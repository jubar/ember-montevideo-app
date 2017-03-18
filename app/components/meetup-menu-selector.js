import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  meetup: service(),
  classNames: ['meetup-menu-selector'],
  currentYear: null,
  years: computed.alias('meetup.yearsMenu'),
  items: [],
  isLoading: true,

  init() {
    this._super(...arguments);

    this.set('currentYear', this.get('years.lastObject'));
    this.get('meetup').getMenues(this.get('currentYear')).then((items) => {
      this.set('items', items);
    }).finally(() => {
      this.set('isLoading', false);
    });
  },

  actions: {
    changeMenu(year) {
      this.set('isLoading', true);
      this.set('currentYear', year);

      this.get('meetup').getMenues(this.get('currentYear')).then((items) => {
        this.set('items', items);
      }).finally(() => {
        this.set('isLoading', false);
      });
    }
  }
});
