/*
 * grunt-init-wordpress
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 Fixate, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a WordPress project.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ is used to localise the WordPress install.' +
  '\n\n'+
  '_Project title_ should be a human-readable title' +
  '\n\n'+
  'You will need to run *npm install*, followed by *grunt init-wp* ' +
  'to configure localisations, symlinks, and file and folder structures ' +
  'once this template has run.';

// Template-specific notes to be displayed after question prompts.
exports.after = '\*\*\* WordPress project installed! \*\*\*' +
  '\n\n' +
  'run _npm install_ to install dependencies. Then: ' +
  '\n\n' +
  'run  _grunt init-wp_  to configure your WordPress install.' +
  '\n\n' +
  'For more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    {
      name: 'theme_folder',
      message: 'Theme folder name:',
      default: '',
      validator: /^[\w\-\.]+$/,
      warning: 'Must be only letters, numbers, dashes, dots or underscores.'
    },
    {
      name: 'theme_local',
      message: 'Theme localisation name:',
      default: ''
    },
    init.prompt('title'),
    init.prompt('version', '1.0.0'),
    init.prompt('homepage'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url')
  ], function(err, props) {

    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: ['src/wp-includes/**/*', 'src/wp-admin/**/*', 'src/wp-content/plugins/**/*']});

    // Generate pacakge.json file.
    // init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};