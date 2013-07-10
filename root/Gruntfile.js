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
      // Minify js
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        my_target: {
          files: {
            '<%= pkg.path.js %>/main.min.js': ['<%= pkg.path.js %>/main.js']
          }
        }
      },
      // Run js through jshint
      jshint: {
        files: ['gruntfile.js', 'styleguide/styleguide-js/main.js', '<%= pkg.path.js %>/main.js'],
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      // Run a local server
      connect: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: 'styleguide',
          keepalive: true
        },
        middleware: function(connect, options) {
          return connect.static(options.base);
        }
      },
      // Manage Sass compilation
      sass: {
        dist: {
          options: {
            quiet: false,
            cacheLocation: '<%= pkg.path.scss %>/.sass-cache'
          },
          files: {
            '<%= pkg.path.theme %>/style.css': '<%= pkg.path.scss %>/style.scss'
          }
        }
      },
      // Move files and folders to their respective folders
      copy: {
        init: {
          files: [
            // Copy non-theme files to WordPress root
            {
              expand: true,
              cwd: '<%= pkg.path.theme_parent %>/theme-name/!root',
              src: ['**'],
              dest: 'src'
            },
            // Create theme folder as per package.json
            {
              expand: true,
              cwd: '<%= pkg.path.theme_parent %>/theme-name',
              src: ['**'],
              dest: '<%= pkg.path.theme_parent %>/<%= pkg.props.theme_folder %>'
            },
            // Copy styleguide css to theme
            {
              expand: true,
              cwd: 'styleguide/css',
              src: ['**'],
              dest: '<%= pkg.path.theme %>/css'
            },
            // Copy fonts to theme
            {
              expand: true,
              cwd: 'styleguide/fnt',
              src: ['**'],
              dest: '<%= pkg.path.theme %>/fnt'
            }
          ]
        }
      },
      // Remove copied folders
      clean: {
        init: [
          '<%= pkg.path.theme_parent %>/theme-name',
          'styleguide/css',
          'styleguide/fnt',
          'styleguide/style.css',
          'styleguide/.gitignore',
          'styleguide/.htaccess'
          ]
      },
      // Replace text in files
      replace: {
        example: {
          src: ['<%= pkg.path.theme %>/**/*.php', '<%= pkg.path.scss %>/style.scss'],
          overwrite: true,
          replacements: [{
            // theme localisation
            from: /theme_local/g,
            to: '<%= pkg.props.theme_local %>'
          },{
            // theme @subpackage
            from: /theme_folder/g,
            to: '<%= pkg.props.theme_folder %>'
          },{
            // theme name
            from: /Theme_Name/g,
            to: '<%= pkg.props.theme_name %>'
          }]
        }
      },
      // Create symlinks
      symlink: {
        css: {
          dest: 'styleguide/style.css',
          relativeSrc: '..<%= pkg.path.theme %>'
        },
        cssdir: {
          dest: 'styleguide/css',
          relativeSrc: '..<%= pkg.path.css %>',
          options: {type: 'dir'} // 'file' by default
        },
        jsdir: {
          dest: 'styleguide/js',
          relativeSrc: '..<%= pkg.path.js %>',
          options: {type: 'dir'} // 'file' by default
        },
        imgdir: {
          dest: 'styleguide/img',
          relativeSrc: '..<%= pkg.path.img %>',
          options: {type: 'dir'} // 'file' by default
        }
      },
      // Optimise images
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
      // Optimise SVG's
      svgmin: {
        options: {
          plugins: [{
            removeViewBox: false
          }]
        },
        dist: {
          files: [{
              expand: true,
              cwd: '<%= pkg.path.img %>',
              src: ['**/*.svg'],
              dest: '<%= pkg.path.img %>'
          }]
        }
      },
      // Watch for changes to files
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
          files: ['styleguide/styleguide-js/main.js', '<%= pkg.path.js %>/main.js'],
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
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-symlink');

    grunt.registerTask('init-wp', ['copy', 'clean', 'replace', 'symlink']);

    grunt.registerTask('server', ['connect']);

    grunt.registerTask('test', ['sass', 'jshint']);

    grunt.registerTask('optim', ['imageoptim', 'svgmin']);

    grunt.registerTask('default', ['sass', 'jshint', 'uglify']);

  };
}());