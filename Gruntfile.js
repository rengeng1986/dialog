/*
 * class
 * https://github.com/crossjs/class
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var transport = require('grunt-cmd-transport');
  var style = transport.style.init(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    idleading: '<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/',

    sea: 'sea-modules/<%= idleading %>',

    jshint: {
      files: ['src/*.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report/',
          linesThresholdPct: 85
        }
      },
      all: ['test/*.html']
    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'report/*.info'
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src',
          outdir: 'doc',
          themedir: 'vendor/yuidoc-bootstrap'
        }
      }
    },

    clean: {
      pages: {
        files: {
          src: ['gh-pages/**/*', '!gh-pages/.git*']
        }
      },
      doc: {
        files: {
          src: ['doc/**']
        }
      },
      dist: {
        files: {
          src: ['dist/**/*']
        }
      },
      build: {
        files: {
          src: ['.build/**']
        }
      },
      sea: {
        files: {
          src: ['<%= sea %>**']
        }
      }
    },

    copy: {
      doc: {
        files: [{
          expand: true,
          cwd: 'doc/',
          src: ['**'],
          dest: 'gh-pages/'
        }]
      },
      sea: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: '<%= sea %>'
        }]
      }
    },

    transport: {
      options: {
        debug: true,
        idleading: '<%= idleading %>',
        alias: '<%= pkg.spm.alias %>'
      },
      js: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: '.build/'
        }]
      },
      handlebars: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.handlebars'],
          dest: '.build/'
        }]
      },
      css: {
        options: {
          parsers: {
            '.css' : [style.css2jsParser]
          }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.css'],
          dest: '.build/'
        }]
      }
    },

    concat: {
      options: {
        debug: true,
        include: 'relative',
        css2js: transport.style.css2js
      },
      dialog: {
        // options: {
        //   debug: true,
        //   include: 'relative'
        // },
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['dialog*.js'],
          dest: 'dist/'
        }]
      },
      others: {
        options: {
          debug: true,
          include: 'self'
        },
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['alert*.js', 'confirm*.js', 'tips*.js', 'mask*.js'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js', '!*-debug*.js'],
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean:dist', 'transport', 'concat', 'clean:build', 'uglify']);

  grunt.registerTask('demo', ['clean:sea', 'copy:sea']);

  grunt.registerTask('doc', ['yuidoc', 'clean:pages', 'copy:doc', 'clean:doc']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['test', 'doc', 'build', 'demo']);

};
