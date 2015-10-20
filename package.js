Package.describe({
  name: 'streemo:wilson',
  version: '0.0.2',
  summary: 'The Wilson algorithm. Score/rank posts, detect spam, make decisions, etc.',
  git: 'https://github.com/Streemo/wilson.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('lib/server/maclaurin.js','server');
  api.addFiles('lib/server/wilson.js','server');
  api.addFiles('lib/server/init.js','server');
  api.export(['Wilson'], 'server');
});
