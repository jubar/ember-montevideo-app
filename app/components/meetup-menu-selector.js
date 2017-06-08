import Ember from 'ember';
import { task } from 'ember-concurrency';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  meetup: service(),
  metrics: service(),
  classNames: ['meetup-menu-selector'],

  years: computed.alias('meetup.yearsMenu'),

  retrieveMeetupsTask: task(function * (year = new Date().getFullYear()) {
    this.set('currentYear', year);
    this.set('isLoading', true);
    this.set('items', (yield this.get('meetup').getMenus(year)).reverse());
    this.set('isLoading', false);
  }).on('init'),

  items: computed(function() {
    return [];
  }),

  actions: {
    changeMenu(year) {
      this.get('metrics').trackEvent({
        category: 'change-year-menu',
        action: 'click-dropdown',
        value: year
      });
      this.get('retrieveMeetupsTask').perform(year);
    }
  }
});
