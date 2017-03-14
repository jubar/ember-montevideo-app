import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  meetup:service(),

  model({ slug }) {
    return this.get('meetup').getMeetupInfo(slug);
  }
});
