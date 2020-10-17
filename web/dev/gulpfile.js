const { src, dest, series, parallel, watch } = require('gulp');
const $ = require('gulp-load-plugins')({lazy: true});
const { company } = require('./package.json');

// Configs

const distPath = './dist';
const srcPath = './src';

// EJS

const ejs = () => (
  src(`${srcPath}/pages/**/index.ejs`)
    .pipe($.ejs({ conf: { company } }, { root: srcPath }))
    .pipe($.htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe($.rename({ extname: '.html' }))
    .pipe(dest(`${distPath}`, ))
)

const ejsWatch = () => watch(`${srcPath}/**/*.ejs`, series(ejs));

// Assets

const assets = () => (
  src(`${srcPath}/assets/**`, { base: `${srcPath}`})
    .pipe(dest(`${distPath}`))
)

const assetsWatch = () => watch(`${srcPath}/assets/**`, series(assets))

// Clean

const clean =  () => src(`${distPath}`, { allowEmpty: true }).pipe($.clean());

// Default

const watchAll = parallel(ejsWatch, assetsWatch);
const dist = parallel(ejs, assets);

exports.clean = clean;
exports.dist = series(clean, dist);
exports.default = series(clean, dist, watchAll);
