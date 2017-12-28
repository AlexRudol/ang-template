const helpers = require('./helpers');
const buildUtils = require('./build-utils');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const autoprefixer = require('autoprefixer');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


function getUglifyOptions (supportES2015) {
    const uglifyCompressOptions = {
        pure_getters: true,
        passes: 3
    };

    return {
        ecma: supportES2015 ? 6 : 5,
        warnings: false,
        ie8: false,
        mangle: true,
        compress: uglifyCompressOptions,
        output: {
            ascii_only: true,
            comments: false
        }
    };
}

module.exports = function(env) {
    const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
    const supportES2015 = buildUtils.supportES2015(buildUtils.DEFAULT_METADATA.tsConfigPath);
    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 8080,
        ENV: ENV,
        HMR: false
    });

    // set environment suffix so these environments are loaded.
    METADATA.envFileSuffix = METADATA.E2E ? 'e2e.prod' : 'prod';

    return webpackMerge(commonConfig({ env: ENV, metadata: METADATA }), {

        output: {
            path: helpers.root('dist'),
            filename: '[name].[chunkhash].bundle.js'
            //sourceMapFilename: '[file].map',
            //chunkFilename: '[name].[chunkhash].chunk.js'
        },

        plugins: [

            new SourceMapDevToolPlugin({
                filename: '[file].map[query]',
                moduleFilenameTemplate: '[resource-path]',
                fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
                sourceRoot: 'webpack:///'
            }),

            new PurifyPlugin(),
            new HashedModuleIdsPlugin(),
            new ModuleConcatenationPlugin(),

            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: false,
                    ecma: 6,
                    warnings: false,
                    mangle: true,
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            }),

            new CompressionPlugin({
                regExp: /\.css$|\.js$/,
                threshold: 2 * 1024
            })

        ],

        node: {
            global: true,
            crypto: 'empty',
            process: false,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
};
