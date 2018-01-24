import gulp from "gulp";
import {
	spawn
} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import less from "gulp-less";
import path from "path";
import svgSprite from "gulp-svg-sprites";
import responsive from "gulp-responsive";
import spritesmith from "gulp.spritesmith";
import folders from "gulp-folders";
import gulpSequence from'gulp-sequence';


const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", ["less", "js", "sprites","img-sequence", "copyVideo", "favicon"], (cb) => buildSite(cb, [], "production"));

gulp.task('img-sequence', function (cb) {
  gulpSequence("images", cb)
})


gulp.task("build-preview", ["less", "js", "sprites", "images",  "copyVideo", "favicon"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// // Compile CSS with PostCSS
// gulp.task("css", () => (
//   gulp.src("./src/css/*.css")
//     .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
//     .pipe(gulp.dest("./dist/css"))
//     .pipe(browserSync.stream())
// ));

gulp.task('less', function() {
	gulp.src('./src/less/main.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('copyVideo', function() {
	gulp.src('./src/video/**.*')
		.pipe(gulp.dest('./dist/assets/video'));
});

gulp.task('favicon', function() {
	gulp.src('./src/favicons/**.*')
		.pipe(gulp.dest('./dist/assets/favicons'));
});

// Compile Javascript
gulp.task("js", (cb) => {
	const myConfig = Object.assign({}, webpackConfig);

	webpack(myConfig, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			colors: true,
			progress: true
		}));
		browserSync.reload();
		cb();
	});
});

//task for svg sprites
gulp.task('sprites', function() {
	return gulp.src('./src/svg/*.svg')
		.pipe(svgSprite({
			mode: "symbols"
		}))
		.pipe(gulp.dest("./dist/assets/svg"));
});

//task for responsive images
gulp.task('images', function() {
	return gulp.src(['src/images/*.{jpg,png}'])
		.pipe(responsive({
			'*': [{
					rename: {
						suffix: '-original'
					},
				},{
					width: 100,
					withoutEnlargement: false,
					rename: {
						suffix: '-thumbnail'
					},
				}, {
					width: 1024,
					withoutEnlargement: false,
					rename: {
						suffix: '-large'
					},
				}, {
					width: 800,
					withoutEnlargement: false,
					rename: {
						suffix: '-medium'
					},
				}, {
					width: 600,
					withoutEnlargement: false,
					rename: {
						suffix: '-small'
					},
				}, {
					width: 2048,
					withoutEnlargement: false,
					rename: {
						suffix: '-retina'
					},
				}
			]
		}, {
			// Global configuration for all images
			// The output quality for JPEG, WebP and TIFF output formats
			quality: 70,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Zlib compression level of PNG output format
			compressionLevel: 6,
			// Strip all metadata
			withMetadata: false,

			skipOnEnlargement: false,
			errorOnEnlargement: false,



		}))
		.pipe(gulp.dest('dist/assets/img'));
});


// Development server with browsersync
gulp.task("server", ["hugo", "less", "js"], () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch("./src/js/**/*.js", ["js"]);
	gulp.watch("./src/less/**/*.less", ["less"]);
	gulp.watch("./site/**/*", ["hugo"]);
	gulp.watch("./src/svg/**/*", ["sprites"]);
	gulp.watch("./src/images/**/*", ["images"]);

});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
	const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

	process.env.NODE_ENV = environment;

	return spawn(hugoBin, args, {
		stdio: "inherit"
	}).on("close", (code) => {
		if (code === 0) {
			browserSync.reload();
			cb();
		} else {
			browserSync.notify("Hugo build failed :(");
			cb("Hugo build failed");
		}
	});
}
