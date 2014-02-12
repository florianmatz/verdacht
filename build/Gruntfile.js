module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    //pfad zur package
    pkg: grunt.file.readJSON('package.json'),

    //Überwacht alle .less dateien, und führt bei Änderung den Less Task aus
    watch: {
      files: ['../source/assets/less/**/*.less', '../source/assets/libs/**/*.less'],
      tasks: ['less:development', 'autoprefixer']
    },

    //kompiliert alle .less dateien aus angegebenem Verzeichnis ins .css dateien
    less : {

      development: {
        options: {
          paths: ['../source/assets/less', '../source/assets/libs/bootstrap/less']
        },
        files: {
          '../source/assets/css/style.css' : '../source/assets/less/style.less'
        }
      }

    },

    clean: {
      publish: {
        src: ['../publish'],
        options: {
          force: true
        }
      }
    },

    copy: {
      publish: {
        files: [
          {
            src: ['**', '!assets/less/**', '!assets/js/**', '!assets/libs/**'],
            dest: '../publish/',
            expand: true,
            cwd: '../source/',
            dot: true
          }
        ]
      }
    },

    uncss: {
      publish: {
        files: {
          '../publish/assets/css/style.css': ['../publish/index.html','../publish/privacy.html']
          }
        }
    },

    cssmin: {
      publish: {
        files: {
          '../publish/assets/css/style.css': ['../publish/assets/css/style.css']
        }
      }
    },

    autoprefixer: {

      main: {
        options: {
          browsers: ['last 2 version']
        },
        src: '../source/assets/css/style.css'
      }
    },

    requirejs: {
      publish: {
        options: {
          name: 'main',
          baseUrl: '../source/assets/js',
          mainConfigFile: '../source/assets/js/main.js',
          out: '../publish/js/main.js',
          include: ['../source/assets/libs/requirejs/require']
        }
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-autoprefixer');


  // Default task.
  grunt.registerTask('default', 'clean');
  grunt.registerTask('build', ['clean', 'copy', 'requirejs', 'uncss', 'cssmin']);

};