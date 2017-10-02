module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		sass: {
			dist: {
				files: {
					'site/static/css/style.min.css' : 'site/themes/pottwal/static/scss/styles.scss'
				}
			}
		}
		uglify:{
			options:
				sourceMap: true
				sourceMapIn: 'site/static/js/mysite.js.map'
			dist:
				src: 'site/static/js/mysite.js'
				dest: 'site/static/js/mysite.min.js'
		}
		copy:{
			main:{
				# includes files within path
				expand: true,
				src: [
					'node_modules/bootstrap/**',
					'node_modules/jquery/**'
					'node_modules/underscore/**'

					],
				dest: 'site/themes/pottwal/static',
				filter: 'isFile'
			}

		}
		responsive_images:{
			process:{
				options:{
					engine: 'gm'
					separator: '_'
					sizes: [
						# Copy the source.
						{ rename: false, width: '100%', height: '100%' }

						# different sizes for cropped images
						{ name: '2000x400', width: 2000, height: 400, aspectRatio: false }
						{ name: '1025x300', width: 1025, height: 300, aspectRatio: false }
						{ name: '768x300', width: 768, height: 300, aspectRatio: false }
						{ name: '480x200', width: 480, height: 200, aspectRatio: false }

						# different sizes for non cropped images
						{ name: '2000', width: 2000 }
						{ name: '1024', width: 1024 }
						{ name: '768', width: 768 }
						{ name: '480', width: 768 }


					]
			},
				files: [
					expand: true
					cwd: 'img'
					src: '**.{png,jpg,jpeg,gif}'
					dest: 'site/static/img'
				]
			}
	},



		svg_sprite : {
			dist : {
				expand : true,
				cwd : 'site/themes/pottwal/static/svg/',
				src : '**/*.svg',
				dest : 'site/themes/pottwal/static',
				options : "mode": {
					"symbol": true,
					"log": "verbose",
					"inline": true
				}

			}
		}

		watch:
			options:
				atBegin: true
				livereload: true
			sass:
				files: ['site/themes/pottwal/static/scss/*.scss']
				tasks: 'sass:dist'
			images:
				files: ['img/**']
				tasks: 'responsive_images'
			hugo:
				files: ['site/**']
				tasks: 'hugo:dev'
			svg:
				files: ['site/themes/pottwal/static/svg/**']
				tasks: 'svg_sprite:dist'
			all:
				files: ['Gruntfile.coffee']
				tasks: 'dev'
		connect:
			mysite:
				options:
					hostname: '127.0.0.1'
					port: 8080
					protocol: 'http'
					base: 'build/dev'
					livereload: true
		'gh-pages': {
			options: {
				base: 'build/dist'
			},
			src: ['**']
		}

	grunt.registerTask 'hugo', (target) ->
		done = @async()
		args = ['--source=site', "--destination=../build/#{target}"]
		if target == 'dev'
			args.push '--baseUrl=http://127.0.0.1:8080'
			args.push '--buildDrafts=true'
			args.push '--buildFuture=true'
		hugo = require('child_process').spawn 'hugo', args, stdio: 'inherit'
		(hugo.on e, -> done(true)) for e in ['exit', 'error']

	grunt.loadNpmTasks plugin for plugin in [
		'grunt-contrib-coffee'
		'grunt-contrib-uglify'
		'grunt-contrib-copy'
		'grunt-contrib-less'
		'grunt-contrib-sass'
		'grunt-contrib-watch'
		'grunt-contrib-connect'
		'grunt-responsive-images'
		'grunt-svg-sprite'
		'grunt-gh-pages'
	]
	grunt.registerTask 'dev', [ 'sass:dist', 'copy:main', 'svg_sprite','responsive_images', 'hugo:dev']
	grunt.registerTask 'default', [ 'sass:dist', 'copy:main', 'uglify','svg_sprite', 'responsive_images', 'hugo:dist']
	grunt.registerTask 'edit', ['connect', 'watch']
	grunt.registerTask 'deploy', ['gh-pages']
