/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:jquery.stickysidebar.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      js: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.<%= pkg.name %>.css>'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    min: {
      js: {
        src: ['<banner:meta.banner>', '<config:concat.js.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      css: {
        src: '<config:concat.css.dest>',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    csslint: {
      base: {
        src: "src/*.css",
        rules: {
          "import": false,
          "overqualified-elements": 2
        }
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-css');

  grunt.registerTask('default', 'lint concat min cssmin csslint');

};
