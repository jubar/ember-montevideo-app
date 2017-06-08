import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
  metrics: service(),
  classNames: ['sidebar-menu-logo'],

  actions: {
    toggleonfetti() {
      this.get('metrics').trackEvent({
        category: 'confetti',
        action: this.get('easterEgg') ? 'turn-off': 'turn-on'
      });

      this.toggleProperty('easterEgg');
    }
  }
});
