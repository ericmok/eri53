module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            compile: {
                files: {
                    '../static/website/common/stylesheets/main.css': 'stylesheets/main.less'
                }
            }
        },
        watch: {
            stylesheets: {
                files: 'stylesheets/**.less',
                tasks: ['less:compile']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['less:compile', 'watch']);
};
