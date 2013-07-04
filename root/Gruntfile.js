/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

(function () {
  'use strict';
  module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            '<%= pkg.path.js %>/shared/ui.min.js': '<%= pkg.path.js %>/shared/ui.js'
          }
        }
      },
      jshint: {
        files: ['gruntfile.js', 'static/styleguide/styleguide-js/main.js'],
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      connect: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: 'static/styleguide',
          keepalive: true
        },
        middleware: function(connect, options) {
          return connect.static(options.base);
        }
      },
      sass: {                              // Task
        dist: {                            // Target
          options: {
            quiet: false,
            cacheLocation: '<%= pkg.path.scss %>/.sass-cache'
          },
          files: {                         // Dictionary of files
            '<%= pkg.path.css %>/style.css': '<%= pkg.path.scss %>/style.scss'       // 'destination': 'source'
          }
        }
      },
      imageoptim: {
        files: [
          '<%= pkg.path.img %>'
        ],
        options: {
          // also run images through ImageAlpha.app before ImageOptim.app
          imageAlpha: true,
          // also run images through JPEGmini.app after ImageOptim.app
          // jpegMini: true,
          // quit all apps after optimisation
          quitAfter: true
        }
      },
      watch: {
        gruntfile: {
          files: 'Gruntfile.js',
          tasks: ['jshint']
        },
        css: {
          files: ['<%= pkg.path.scss %>/**/*.scss'],
          tasks: ['sass']
        },
        styleguide: {
          files: ['static/styleguide/styleguide-js/main.js'],
          tasks: ['jshint']
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-imageoptim');

    grunt.registerTask('test', ['sass', 'jshint']);

    grunt.registerTask('optim', ['imageoptim']);

    grunt.registerTask('default', ['sass', 'jshint', 'uglify']);

    grunt.registerTask('server', ['connect']);

  };
}());