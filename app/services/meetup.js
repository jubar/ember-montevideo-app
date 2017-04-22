import Ember from 'ember';
import MeetupMenu from '../models/meetup-menu';
import MeetupEvent from '../models/meetup';
import ENV from 'ember-montevideo-website/config/environment';

const { computed, Service, RSVP, run, isNone } = Ember;

export default Service.extend({
  allMenus: computed(function() {
    return [];
  }),
  nextMeetup: null,
  lastMeetup: null,
  nextMeetupParticipants: null,

  yearsMenu: computed('allMenus.[]', function() {
    return this.get('allMenus')
      .map((menu) => menu.get('name').substring(0,4))
      .reduceRight((years, current) => {
        if (!years.includes(current)) {
          years.push(current);
        }

        return years;
      }, []);
  }),

  _createMeetupEvent(event) {
    if (isNone(event)) {
      return null;
    }

    return MeetupEvent.create({
      meetupId: event.id,
      name: event.name,
      description: event.description,
      duration: event.duration,
      link: event.link,
      when: new Date(event.time),
      where: event.venue.name,
      city: event.venue.city,
      country: event.venue.country,
      rsvpLimit: event.rsvp_limit,
      yesRsvpCount: event.yes_rsvp_count,
      waitlistCount: event.waitlist_count
    });
  },

  /**
   * Generates menu items by fetching all markdown files from a Github repository.
   *
   * File name format should have this format yyyy-mm.md
   *
   * @param filter {String} - filter items by text
   * @return {Promise}
   */
  getMenus(filter = 'all') {
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('allMenus.length') > 0) {
        if (filter === 'all') {
          return resolve(this.get('allMenus').reverse());
        } else {
          let filteredMenus = this.get('allMenus').filter((item) => {
            return item.get('name').startsWith(filter);
          });
          return resolve(filteredMenus);
        }
      }

      Ember.$.ajax({ url: ENV.API.githubMarkdowns })
        .done((data) => {
        run(() => {
          data.filterBy('type', 'dir').forEach((content) => {
            if (content.name) {
              let menu = MeetupMenu.create({
                name: content.name.split('.')[0], // Remove the extension of the file
                path: content.path,
                url: content.url
              });
              this.get('allMenus').pushObject(menu);
            }
          });

          if (filter === 'all') {
            resolve(this.get('allMenus'));
          } else {
            let filteredMenus = this.get('allMenus').filter((item) => {
              return item.get('name').startsWith(filter);
            });
            resolve(filteredMenus);
          }
        });
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  /*
  Gets information about next ember meetup using meetup API.

  If not next meetup, returns null.
  */
  getNextMeetup() {
    return new RSVP.Promise((resolve, reject) => {
      if (!isNone(this.get('nextMeetup'))) {
        return resolve(this.get('nextMeetup'));
      }

      Ember.$.ajax({
        url: ENV.API.meetupEvents,
        jsonp: "callback",
        dataType: "jsonp"
      }).done((event) => {
        run(() => {
          let nextMeetup = null;
          if (event.data && event.data[0]) {
            nextMeetup = this._createMeetupEvent(event.data[0]);
          }

          this.set('nextMeetup', nextMeetup);
          resolve(nextMeetup);
        });
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  /*
  Gets information about last ember meetup using meetup API.

  If not last meetup, returns null.
  */
  getLastMeetup() {
    return new RSVP.Promise((resolve, reject) => {
      if (!isNone(this.get('lastMeetup'))) {
        return resolve(this.get('lastMeetup'));
      }

      Ember.$.ajax({
        url: ENV.API.meetupLastEvent,
        jsonp: "callback",
        dataType: "jsonp"
      }).done((event) => {
        run(() => {
          let lastMeetup = null;
          if (event.data && event.data[0]) {
            lastMeetup = this._createMeetupEvent(event.data[0]);
          }

          this.set('lastMeetup', lastMeetup);
          resolve(lastMeetup);
        });
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  getRSVP(meetupId) {
    return new RSVP.Promise((resolve, reject) => {
      if (!isNone(this.get('nextMeetupParticipants'))) {
        return resolve(this.get('nextMeetupParticipants'));
      }

      Ember.$.ajax({
        url: ENV.API.meetupRSVPs.replace(/%ID/, meetupId),
        jsonp: "callback",
        dataType: "jsonp"
      }).done((participants) => {
        run(() => {
          this.set('nextMeetupParticipants', participants);
          resolve(participants);
        });
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  getPhotos(meetupId) {
    return new RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: ENV.API.meetupPhotos.replace(/%ID/, meetupId),
        jsonp: "callback",
        dataType: "jsonp"
      }).done((photos) => {
        run(() => {
          resolve(photos);
        });
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  /*
  This method returns a markdown file located under meetups directories in github.

  This method assume the file is a markdown and the directory is meetups.
  */
  getMeetupInfo(slug) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: ENV.API.githubMarkdown.replace(/%SLUG/, slug)
      }).done((data) => {
        // FIXME: This is a quick hack to fix the URL of the images
        data = data.replace(/\.\/(.+?\.(png|gif|jpg))/g, `https://raw.githubusercontent.com/ember-montevideo/meetups/master/${slug}/$1`);
        resolve(data);
      }).fail((error) => {
        console.error('ERROR: ', error);
        reject(error);
      });
    });
  },

  init() {
    this._super(...arguments);

    this.getNextMeetup();
    this.getLastMeetup();
  }
});
