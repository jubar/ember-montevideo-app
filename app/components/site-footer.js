import Ember from 'ember';

const { Component, inject: { service }, computed } = Ember;

export default Component.extend({
  meetup: service(),
  classNames: ['row', 'footer'],
  nextMeetup: computed.alias('meetup.nextMeetup'),
  meetupId: computed('nextMeetup', function() {
    return this.get('nextMeetup.meetupId');
  })
});
