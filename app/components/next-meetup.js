import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
  meetup: service(),
  isLoading: true,
  nextMeetup: null,

  init() {
    this._super(...arguments);

    this.set('isLoading', true);
    this.get('meetup').getNextMeetup().then((meetup) => {
      this.set('nextMeetup', meetup);
    }).finally(() => {
      this.set('isLoading', false);
    });
  }
});
