import Ember from 'ember';

export default Ember.Object.extend({
  meetupId: '',
  name: '',
  description: '',
  duration: 0,
  link: '', // Url of the meetup event,
  when: '',
  where: null,
  rsvpLimit: 0,
  waitlistCount: 0,
  yesRsvpCount: 2
});
