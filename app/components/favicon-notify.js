/* global moment */
import Ember from 'ember';
import Tinycon from 'tinycon';

const { Component, inject: { service }} = Ember;

export default Component.extend({
  meetup: service(),
  tagName: null,

  init() {
    this._super(...arguments);

    this.get('meetup').getNextMeetup().then((nextMeetup) => {
      if (nextMeetup && nextMeetup.get('when')) {
        Tinycon.setOptions({
          background: '#e24c32'
        });
        let now = moment();
        let to = moment(nextMeetup.get('when'));
        Tinycon.setBubble(to.diff(now, 'days'));
      }
    });
  }
});
