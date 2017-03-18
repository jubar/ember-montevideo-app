import Ember from 'ember';

const { Component, String: { htmlSafe }, computed, inject: { service } } = Ember;

export default Component.extend({
  meetup: service(),
  nextMeetup: computed.alias('meetup.nextMeetup'),
  classNames: ['main-banner'],
  attributeBindings: ['backgroundStyle:style'],

  backgroundStyle: computed('bgUrl', function() {
    let gradient = 'linear-gradient(to bottom, rgba(0,0,0,.8) 0%, rgba(0,0,0,.95) 100%)';
    return htmlSafe(`background-image: ${gradient}, url("${this.get('bgUrl')}");`);
  })
});
