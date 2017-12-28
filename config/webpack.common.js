const helpers = require('./helpers');

const DefinePlugin = require('webpack/lib/DefinePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const DirectoryTreePlugin = require('directory-tree-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

const buildUtils = require('./build-utils');

module.exports = function(options) {
    const isProd = options.env === 'production';
    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, options.metadata || {});
    const ngcWebpackConfig = buildUtils.ngcWebpackSetup(isProd, METADATA);
    const supportES2015 = buildUtils.supportES2015(METADATA.tsConfigPath);

    const entry = {
        polyfills: './src/polyfills.ts',
        main:      './src/main.ts'
    };

    Object.assign(ngcWebpackConfig.plugin, {
        tsConfigPath: METADATA.tsConfigPath,
        mainPath: entry.main
    });

    return {

        entry: entry,

        resolve: {
            mainFields: [ ...(supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main' ],
            extensions: ['.ts', '.js', '.json'],
            modules: [helpers.root('src'), helpers.root('node_modules')],
            alias: buildUtils.rxjsAlias(supportES2015)
        },

        module: {
            rules: [
                ...ngcWebpackConfig.loaders,
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [ 'to-string-loader', 'css-loader' ]
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        'to-string-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    require('postcss-smart-import'),
                                    require('autoprefixer')({
                                        browsers: ['last 2 version', 'ie 11']
                                    })
                                ]
                            },
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                }
            ],
        },

        plugins: [

            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'AOT': METADATA.AOT,
                'process.env.ENV': JSON.stringify(METADATA.ENV),
                'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
                'process.env.HMR': METADATA.HMR
            }),

            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),

            new CommonsChunkPlugin({
                minChunks: Infinity,
                name: 'inline'
            }),
            new CommonsChunkPlugin({
                name: 'main',
                async: 'common',
                children: true,
                minChunks: 2
            }),

            new ExtractTextPlugin('[name].[contenthash].css'),

            new CopyWebpackPlugin([
                    { from: 'src/assets', to: 'assets' }
                ],
                isProd ? { ignore: [ 'mock-data/**/*' ] } : undefined
            ),

            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                chunksSortMode: function (a, b) {
                    const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
                    return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
                },
                metadata: METADATA,
                inject: 'body',
                xhtml: true,
                minify: isProd ? {
                    caseSensitive: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true
                } : false
            }),

            new ScriptExtHtmlWebpackPlugin({
                sync: /inline|polyfills|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfills|vendor|main/],
                prefetch: [/chunk/]
            }),

            new LoaderOptionsPlugin({}),

            new ngcWebpack.NgcWebpackPlugin(ngcWebpackConfig.plugin),

            new InlineManifestWebpackPlugin(),

            new DirectoryTreePlugin({
                dir: 'src/assets/data/',
                path: 'src/assets/_content.json',
                extensions: /\.json/
            })
        ],

        node: {
            global: true,
                crypto: 'empty',
                process: true,
                module: false,
                clearImmediate: false,
                setImmediate: false
        }

    };
};
