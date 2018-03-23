module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['*.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
		package: './package.json',
		readme: './README.md',
                destination: 'public/jsdocs/',
                configure: './node_modules/jsdoc/conf.json',
                template: './node_modules/ink-docstrap/template'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

};
