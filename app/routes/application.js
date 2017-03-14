import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  meetup: service(),

  model() {
    return this.get('meetup').getMenues('2017');
  }
});
