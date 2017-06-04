import Ember from 'ember';
import { task } from 'ember-concurrency';

const { Component, inject: { service }, isNone, computed } = Ember;

export default Component.extend({
  meetup: service(),
  metrics: service(),
  classNames: ['participants'],
  participants: computed(function() {
    return [];
  }),

  retrieveParticipants: task(function * () {
    try {
      this.set('isLoading', true);
      let result = yield this.get('meetup').getRSVP(this.get('meetupId'));
      let members = [];
      if (result) {
        result.data.forEach((rsvp) => {
          if (!isNone(rsvp.member)) {
            let imageUrl = 'assets/images/no-avatar.gif';
            let { id, name, photo } = rsvp.member;
            if (photo && !isNone(photo.thumb_link)) {
              imageUrl = photo.thumb_link;
            }
            members.push({ id, name, imageUrl });
          }
        });
      }

      this.set('participants', members);
    } catch(error) {
      this.set('participants', []);
    } finally {
      this.set('isLoading', false);
    }
  }).on('init'),

  actions: {
    join() {
      this.get('metrics').trackEvent({
        category: 'join',
        action: 'footer-join'
      });

      window.location.assign('http://meetup.com/ember-montevideo/');
    }
  }
});
