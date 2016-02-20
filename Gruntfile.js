/*! Gruntfile.js */

module.exports = function(grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadTasks('./tasks');

  var jshint_src = [
      './*.js',
      './*.json',
      'lib/**/*.js',
      'lib/**/*.json',
      'tasks/**/*.js',
      'test/**/*.js',
      'test/**/*.json'
  ];

  var jsdoc_src = [
      './index.js',
      'lib/**/*.js'
  ];

  grunt.initConfig({

    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      all: {
        src: jshint_src
      },
      options: {
        "node": true,
        "browser": true,
        "bitwise": true,
        "noarg": true,
        "regexp": true,
        "undef": true,
        "globals": {
          describe: true, // mocha
          it: true,
          after: true
        }
      }
    },

    // https://github.com/pghalliday/grunt-mocha-test
    mochaTest: {
      all: {
        src: ['test/**/*.test.js']
      },
      options: {
        reporter: 'spec'
      }
    },

    // https://github.com/krampstudio/grunt-jsdoc-plugin
    jsdoc: {
      all: {
        src: jsdoc_src
      },
      options: {
        destination: 'gh-pages/docs',
        "plugins": ["plugins/markdown"],
        "markdown": {
          "parser": "gfm"
        }
      }
    },

    // https://github.com/jmreidy/grunt-browserify
    browserify: {
      all: {
        files: {
          './build/obop.browserify.js': ['./index.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'obop'
          }
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      all: {
        files: {
          './build/obop.min.js': ['./build/obop.browserify.js']
        },
        options: {
          banner: '/*! ' + pkg.name + ' ' + pkg.version + ' */\n'
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-watch
    watch: {
      scripts: {
        files: jshint_src,
        tasks: ['default'],
        options: {
          interrupt: true,
        }
      },
      docs: {
        files: jsdoc_src,
        tasks: ['jsdoc'],
        options: {
          interrupt: true,
        }
      }
    },

    // tasks/quote-json.js
    quoteJson: {
      bower: {
        src: 'package.json',
        dest: 'bower.json',
        options: {
          fields: {
            name: 1,
            version: 1,
            homepage: 1,
            description: 1,
            repository: 1
          }
        }
      },
      system: {
        src: 'package.json',
        dest: 'lib/system.json',
        options: {
          fields: {
            name: 1,
            version: 1
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('build', ['quoteJson', 'browserify', 'uglify']);
  grunt.registerTask('all', ['default', 'jsdoc', 'build']);
};
