import Ember from 'ember';
import MeetupMenu from '../models/meetup-menu';
import MeetupEvent from '../models/meetup';

const { Service, RSVP, run, isNone } = Ember;

export default Service.extend({
  allMenus: Ember.A(),
  yearsMenu: Ember.A(),
  nextMeetup: null,
  lastMeetup: null,

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

      let url = `https://api.github.com/repos/jubar/ember-montevideo.github.io/contents/meetups`;

      Ember.$.ajax({
        url
      }).done((data) => {
        run(() => {
          data.forEach((content) => {
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
          if (event.data && event.data[0]) {
            let eventData = event.data[0];
            let nextMeetup = MeetupEvent.create({
              meetupId: eventData.id,
              name: eventData.name,
              description: eventData.description,
              duration: eventData.duration,
              link: eventData.link,
              when: new Date(eventData.time),
              where: eventData.venue.name,
              city: eventData.venue.city,
              country: eventData.venue.country,
              rsvpLimit: eventData.rsvp_limit,
              yesRsvpCount: eventData.yes_rsvp_count,
              waitlistCount: eventData.waitlist_count
            });

            this.set('nextMeetup', nextMeetup);
          } else {
            this.set('nextMeetup', null);
          }

          resolve(this.get('nextMeetup'));
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
          if (event.data && event.data[0]) {
            let eventData = event.data[0];
            let nextMeetup = MeetupEvent.create({
              meetupId: eventData.id,
              name: eventData.name,
              description: eventData.description,
              duration: eventData.duration,
              link: eventData.link,
              when: new Date(eventData.time),
              where: eventData.venue.name,
              city: eventData.venue.city,
              country: eventData.venue.country,
              rsvpLimit: eventData.rsvp_limit,
              yesRsvpCount: eventData.yes_rsvp_count,
              waitlistCount: eventData.waitlist_count
            });

            this.set('lastMeetup', nextMeetup);
          } else {
            this.set('lastMeetup', null);
          }

          resolve(this.get('lastMeetup'));
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
    let url = `https://raw.githubusercontent.com/jubar/ember-montevideo.github.io/master/meetups/${slug}.md`;

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
