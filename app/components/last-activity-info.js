import Ember from 'ember';

const { Component, inject: { service }, computed } = Ember;

export default Component.extend({
  meetup: service(),
  classNames: ['last-activity'],

  lastMeetup: computed.alias('meetup.lastMeetup')
});
