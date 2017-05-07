/* global moment */
import Ember from 'ember';

const { Route, inject: { service }, RSVP, String: { capitalize } } = Ember;

export default Route.extend({
  meetup: service(),

  model({ slug }) {
    return new RSVP.hash({
      title: capitalize(moment(slug).format('MMMM YYYY')),
      content: this.get('meetup').getMeetupInfo(slug)
    });
  }
});
