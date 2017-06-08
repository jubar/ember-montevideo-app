/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-montevideo-website',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },

    metricsAdapters: [{
      name: 'GoogleAnalytics',
      environments: ['development', 'production'],
      config: {
        id: 'UA-98694123-1',
        // Use `analytics_debug.js` in development
        debug: environment === 'development',
        // Use verbose tracing of GA events
        trace: environment === 'development',
        // Ensure development env hits aren't sent to GA
        sendHitTask: environment !== 'development'
      }
    }],

    moment: {
      includeLocales: ['es']
    },

    googleFonts: ['Share+Tech+Mono', 'Roboto'],

    // Set or update content security policies
    contentSecurityPolicy: {
      'default-src': "'none'",
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com",
      'script-src': "'self' https://www.google-analytics.com/",
      'connect-src': "'self' https://www.google-analytics.com/",
      'img-src': "'self'",
      'media-src': "'self'"
    },

    APP: {},

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
    // ENV.rootURL = "/ember-montevideo-app/";
    ENV.locationType = 'hash';
    ENV.rootURL = "/"; // URL for js.uy
  }

  return ENV;
};
