import Ember from 'ember';
import MeetupMenu from '../models/meetup-menu';
import MeetupEvent from '../models/meetup';

const { Service, RSVP, run, isNone } = Ember;

export default Service.extend({
  allMenus: Ember.A(),
  yearsMenu: Ember.A(),
  nextMeetup: null,
  lastMeetup: null,
  nextMeetupParticipants: null,

  _generateYearsMenu() {
    let years = [];
    this.get('allMenus').forEach((menu) => {
      let year = menu.get('name').substring(0,4);

      if (!years.includes(year)) {
        years.push(year);
      }
    });

    this.set('yearsMenu', years.reverse());
  },

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

  /*
  Gets all the markdown files under meetups directory in github.
  Using these markdowns generate the menu items according with the filter.

  Convention assumed for the name of the files is: yyyy-mm.md
  */
  getMenus(filter = 'all') {
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('allMenus.length') > 0) {
        this._generateYearsMenu();

        if (filter === 'all') {
          return resolve(this.get('allMenus').reverse());
        } else {
          let filteredMenus = this.get('allMenus').filter((item) => {
            return item.get('name').startsWith(filter);
          });
          return resolve(filteredMenus);
        }
      }

      let url = `https://api.github.com/repos/ember-montevideo/meetups/contents`;

      Ember.$.ajax({
        url
      }).done((data) => {
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

          this._generateYearsMenu();

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

      let url = 'https://api.meetup.com/ember-montevideo/events?&sign=false&photo-host=public&page=1';

      Ember.$.ajax({
        url,
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

      let url = 'https://api.meetup.com/ember-montevideo/events?&sign=false&photo-host=public&page=1&scroll=recent_past&status=past';

      Ember.$.ajax({
        url,
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

      let url = `https://api.meetup.com/ember-montevideo/events/${meetupId}/rsvps`;

      Ember.$.ajax({
        url,
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
      let url = `https://api.meetup.com/ember-montevideo/events/${meetupId}/photos`;

      Ember.$.ajax({
        url,
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
    let url = `https://raw.githubusercontent.com/ember-montevideo/meetups/master/${slug}/README.md`;

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url
      }).done((data) => {
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
