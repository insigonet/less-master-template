var gulp       = require('gulp'),				// Подключаем Gulp
	less         = require('gulp-less'),			// Подключаем less пакет,
	browserSync  = require('browser-sync'),			// Подключаем Browser Sync
	concat       = require('gulp-concat'),			// Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'),		// Подключаем gulp-uglifyjs (для сжатия JS)
	cleanCSS	 = require('gulp-clean-css'),		// Подключаем gulp-clean-css пакет для минификации CSS
	rename       = require('gulp-rename'),			// Подключаем библиотеку для переименования файлов
	del          = require('del'),				// Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'),		// Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'),		// Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'),			// Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');		// Подключаем библиотеку для автоматического добавления префиксов

// fontawesome
gulp.task('fontawesome', function() {
	var fontAwesome = gulp.src('app/libs/font-awesome/fonts/*')	// Указываем папку шрифтов
		.pipe(gulp.dest('app/fonts')) // Переносим в папку app/fonts
	var cssAwesome = gulp.src('app/libs/font-awesome/css/font-awesome.css') // Указываем CSS файл fontawesome
		.pipe(gulp.dest('app/css')); // Переносим в папку app/css
});
	
// less	
gulp.task('less', function(){
	return gulp.src('app/less/**/*.less') // Указываем источник Less файлов
		.pipe(less()) // Преобразуем Less в CSS посредством gulp-less
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// browser-sync
gulp.task('browser-sync', function() {
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

// scripts
gulp.task('scripts', function() {
	return gulp.src([ // Указываем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

// minify-css
gulp.task('minify-css', ['less'], function() {
	return gulp.src('app/css/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css'));
});





// watch
gulp.task('watch', ['browser-sync', 'minify-css', 'scripts'], function() {
	gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за less файлами в папке less
	gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

// clean
gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

// img
gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

// build
gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим CSS в продакшен
		//'app/css/main.css',
		//'app/css/libs.min.css'
		'app/css/*.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});


gulp.task('clear', function (callback) {
	return cache.clearAll();
})


gulp.task('default', ['watch']);
