/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-montevideo-website',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    moment: {
      // To cherry-pick specific locale support into your application.
      // Full list of locales: https://github.com/moment/moment/tree/2.10.3/locale
      includeLocales: ['es']
    },

    googleFonts: ['Share+Tech+Mono', 'Roboto'],

    // Set or update content security policies
    contentSecurityPolicy: {
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    API: {
      githubMarkdowns: 'https://api.github.com/repos/ember-montevideo/meetups/contents',
      githubMarkdown: 'https://raw.githubusercontent.com/ember-montevideo/meetups/master/%SLUG/README.md',
      meetupEvents: 'https://api.meetup.com/ember-montevideo/events?&sign=false&photo-host=public&page=1',
      meetupLastEvent: 'https://api.meetup.com/ember-montevideo/events?&sign=false&photo-host=public&page=1&scroll=recent_past&status=past',
      meetupRSVPs: 'https://api.meetup.com/ember-montevideo/events/%ID/rsvps',
      meetupPhotos: 'https://api.meetup.com/ember-montevideo/events/%ID/photos'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.rootURL = "/ember-montevideo-app/";
    ENV.locationType = 'hash';
    // ENV.rootURL = "/"; // URL for js.uy
  }

  return ENV;
};
