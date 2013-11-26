/*
 * component.list-view-scroll
 * http://github.amexpub.com/modules/component.list-view-scroll
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.initConfig({
    jsbeautifier: {
      files: ["<%= jshint.all %>"],
      options: {
        "indent_size": 2,
        "indent_char": " ",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "eval_code": false,
        "indent_case": false,
        "unescape_strings": false,
        "space_after_anon_function": true
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: {
        src: 'test/**/*.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'config/**/*.js',
        'index.js',
        'lib/**/*.js',
        'routes/**/*.js',
        'test/**/*.js'
      ]
    },
    copy: {
      main: {
        files: [
          {expand: true,cwd: 'dist', src: ['**'], dest: '../../public/periodic/component.list-view-scroll/'},//
          {expand: true,cwd: 'lib', src: ['component.list-view-scroll.js'], dest: '../../public/periodic/component.list-view-scroll/'}
        ]
      }
    },
    clean: ['../../public/periodic/component.list-view-scroll/'],
    watch: {
      scripts: {
        // files: '**/*.js',
        files: [
          'Gruntfile.js',
          'lib/**/*.js',
          'test/**/*.js',
          'example/scripts/src/*.js',
          'example/stylesheets/*.less'
        ],
        tasks: ['lint', 'less'],
        options: {
          interrupt: true
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["example/assets/css"],
          yuicompress: true
        },
        files: {
          "example/assets/css/app.css": "./public/assets/css/app.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');


  grunt.registerTask('default', ['jshint', 'simplemocha']);
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('test', 'simplemocha');

  grunt.event.on('watch', function(action, filepath, target) {
    exec("browserify "+__dirname+"/example/scripts/src/main.js -o "+__dirname+"/example/scripts/example.js");
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
