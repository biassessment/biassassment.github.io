module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "css/main.css": "less/main.less" // destination file and source file
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      styles: {
        files: ['less/*.less', 'html/*.html', 'js/*.js', 'index.html'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('dev', ['less', 'watch']);
};

