module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    //pfad zur package
    pkg: grunt.file.readJSON('package.json'),

    //Überwacht alle .less dateien, und führt bei Änderung den Less Task aus
    watch: {
      files: ["../source/assets/less/**/*.less", "../source/assets/libs/**/*.less"],
      tasks: ["less:development", "autoprefixer"]
    },

    //kompiliert alle .less dateien aus angegebenem Verzeichnis ins .css dateien
    less : {

      development: {
        options: {
          paths: ["../source/assets/less", "../source/assets/libs/bootstrap/less"]
        },
        files: {
          "../source/assets/css/style.css" : "../source/assets/less/style.less"
        }
      },

      publish: {
        options: {
          paths: ["../source/less"],
          compress: true
        },
        files: {
          "../source/css/style.css" : "../source/less/style.less"
        }
      }

    },

    copy: {
      publish: {
        files: [
          {
            src: ["**", "!less/**", "!js/**", "!templates/**", "!css/.*backup"],
            dest: "../publish/",
            expand: true,
            cwd: "../source/",
            dot: true
          }
        ]
      }
    },

    autoprefixer: {

      main: {
        options: {
          browsers: ['last 2 version']
        },
        src: '../source/assets/css/style.css'
      }
    }

  });


  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-autoprefixer");


  // Default task.
  grunt.registerTask("default", "clean");
  grunt.registerTask("build", ["copy"]);

};