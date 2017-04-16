import Ember from 'ember';

const { Component, inject: { service }, isNone } = Ember;

export default Component.extend({
  classNames: ['participants'],
  meetup: service(),
  isLoading: true,
  participants: [],

  init() {
    this._super(...arguments);

    this.get('meetup').getRSVP(this.get('meetupId')).then((result) => {
      if (!isNone(result)) {
        let members = [];
        result.data.forEach((rsvp) => {
          if (!isNone(rsvp.member)) {
            let { id, name, photo } = rsvp.member;
            members.push({ id, name, photo });
          }
        });
        this.set('participants', members);
      }
    }).catch((error) => {
      console.error('Error', error);
    }).finally(() => {
      this.set('isLoading', false);
    });
  }
});
