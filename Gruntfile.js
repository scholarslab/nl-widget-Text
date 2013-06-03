
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline-Narrative
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-symbolic-link');

  var nlPaths = grunt.file.readJSON('../Neatline/paths.json');
  var paths = grunt.file.readJSON('./paths.json');

  grunt.initConfig({

    symlink: {
      neatline: {
        link: './Neatline',
        target: '../Neatline',
        options: {
          overwrite: true
        }
      }
    },

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 1337
        }
      }
    },

    clean: {
      payloads: [
        paths.payloads.shared.js,
        paths.payloads.shared.css
      ]
    },

    concat: {
      narrative: {
        src: paths.src.shared+'/*.js',
        dest: paths.payloads.shared.js+'/narrative-public.js'
      }
    },

    uglify: {
      narrative: {
        src: '<%= concat.narrative.src %>',
        dest: paths.payloads.shared.js+'/narrative-public.js'
      }
    },

    stylus: {
      compile: {
        files: {
          './views/shared/css/payloads/narrative-public.css':
            paths.stylus.shared+'/*.styl'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<%= concat.narrative.src %>',
          paths.stylus.shared+'/**/*.styl'
        ],
        tasks: ['compile']
      }
    },

    jasmine: {

      options: {
        helpers: [
          './Neatline/'+nlPaths.vendor.js.jasmine_jquery,
          './Neatline/'+nlPaths.vendor.js.sinon,
          './Neatline/'+nlPaths.jasmine+'/helpers/*.js',
          './Neatline/'+nlPaths.jasmine+'/assertions/*.js'
        ]
      },

      neatline: {
        src: [
          './Neatline/'+nlPaths.payloads.shared.js+'/neatline-public.js',
          paths.payloads.shared.js+'/narrative.js'
        ],
        options: {
          specs: paths.jasmine+'/specs/public/**/*.spec.js'
        }
      }

    }

  });

  // Run tests.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'symlink',
    'compile'
  ]);

  // Assemble static assets.
  grunt.registerTask('compile', [
    'concat',
    'stylus'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'uglify',
    'stylus'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'jasmine'
  ]);

  // Mount Jasmine suite.
  grunt.registerTask('jasmine:server', [
    'jasmine:neatline:build',
    'connect'
  ]);

};