/*! Gruntfile.js */

module.exports = function(grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadTasks('./tasks');

  var jsdoc_src = [
    './index.js',
    'lib/**/*.js'
  ];

  grunt.initConfig({

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

  grunt.registerTask('build', ['quoteJson', 'browserify', 'uglify']);
  grunt.registerTask('all', ['jsdoc', 'build']);
};
