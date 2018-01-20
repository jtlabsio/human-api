import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import { spawn } from 'child_process';

export default (() => {
	let
		bunyan,
		node;

	gulp.task('clean', () => del([
		'dist',
		'reports'
	]));

	gulp.task('build', ['clean'], () => {
		return gulp.src('src/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist'));
	});

	gulp.task('default', ['watch', 'start']);

	gulp.task('lint', () => {
		return gulp
			.src(['gulpfile.babel.js', 'src/**/*.js', 'test/**/*.js'])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	});

	gulp.task('start', ['stop', 'build'], () => {
		/* eslint no-magic-numbers:0 */
		bunyan = spawn(
			'./node_modules/.bin/bunyan',
			['-o', 'short'],
			{ stdio : ['pipe', 1, 2] }); // preserves color of bunyan log output
		node = spawn('node', ['dist']);

		node.stdout.pipe(bunyan.stdin);
		node.stderr.pipe(bunyan.stdin);
	});

	gulp.task('stop', () => {
		if (node) {
			node.stdout.unpipe(bunyan.stdin);
			node.kill();
		}

		if (bunyan) {
			bunyan.kill();
		}
	});

	gulp.task('watch', () => gulp.watch(['./src/**/*.js'], ['start']));
})();
