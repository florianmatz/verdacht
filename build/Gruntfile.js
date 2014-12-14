module.exports = function(grunt) {

  var bsTimestamp = new Date().getTime();
  require('time-grunt')(grunt);

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
            src: ['**', '!index.html', '!assets/less/**', '!assets/js/**', '!assets/libs/**'],
            dest: '../publish/',
            expand: true,
            cwd: '../source/',
            dot: true
          }
        ]
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
      development: {
        options: {
          browsers: ['last 2 version']
        },
        src: '../source/assets/css/style.css'
      },
    },

    requirejs: {
      publish: {
        options: {
          name: 'main',
          baseUrl: '../source/assets/js',
          mainConfigFile: '../source/assets/js/main.js',
          out: '../publish/assets/js/main.js',
          include: ['../libs/requirejs/require', 'image']
        }
      }
    },

    processhtml: {
      publish: {
        files: {
          '../publish/index.html': ['../source/index.html']
        }
      }
    },

    'string-replace': {
      publish: {
        files: {
          '../publish/index.html': '../publish/index.html',
        },
        options: {
          replacements: [
            {
              pattern: 'data-bstimestamp=""',
              replacement: 'data-bstimestamp="'+bsTimestamp+'"'
            },
            {
              pattern: 'js"></script>',
              replacement: 'js" async></script>'
            }
          ]
        }
      }
    },

    'ftp-deploy': {
      publish: {
        auth: {
          host: 'v-erdacht.de',
          port: 21,
          authKey: 'verdacht'
        },
        src: '../publish/',
        dest: '/',
        exclusions: ['../publish/assets/sounds']
      }
    },

    compress: {
      html: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: '../publish/',
        src: ['**/*.html'],
        dest: '../publish/',
        ext: '.gz.html',
      },
      css: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: '../publish/',
        src: ['**/*.css'],
        dest: '../publish/',
        ext: '.gz.css'
      },
      js: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: '../publish/',
        src: ['**/*.js'],
        dest: '../publish/',
        ext: '.gz.js'
      }
    },

    'cache-busting': {
        requirejs: {
            replace: ['../publish/index.html'],
            replacement: 'main.js',
            file: '../publish/assets/js/main.js',
            cleanup: true
        },
        css: {
            replace: ['../publish/index.html'],
            replacement: 'style.css',
            file: '../publish/assets/css/style.css',
            cleanup: true 
        }
    },

    imagemin: {                         
      publish: {                        
        files: [{
          expand: true,                  
          cwd: '../publish',                   
          src: ['**/*.{png,jpg,gif}'],   
          dest: '../publish'                  
        }]
      }
    },

    htmlmin: {                                     
      dist: {                                      
        options: {                                 
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        },
        files: {                                  
          '../publish/index.html': '../publish/index.html',    
        }
      }
    },

    connect: {
      dev: {
        options: {
          port: 80,
          base: '../source',
          keepalive: true
        }
      },
      publish: {
        options: {
          port: 8080,
          base: '../publish',
          keepalive: true
        }
      }

    }

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-cache-busting');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-string-replace');

  // Default task.
  grunt.registerTask('default', 'clean');
  grunt.registerTask('build', ['clean', 'less', 'autoprefixer', 'copy', 'cssmin', 'requirejs', 'processhtml', 'string-replace','cache-busting', 'compress', 'imagemin']);
  // grunt.registerTask('build', ['clean', 'less', 'autoprefixer', 'copy', 'cssmin', 'requirejs', 'processhtml', 'string-replace', 'htmlmin', 'cache-busting', 'compress', 'imagemin']);
  grunt.registerTask('deploy', ['build', 'ftp-deploy']);

};