/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
    ENV.git = {
      repo: 'git@github.com:ember-montevideo/ember-montevideo.github.io.git',
      branch: 'master',
      worktreePath: '/tmp/deploy'
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
