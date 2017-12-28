const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const EvalSourceMapDevToolPlugin = require('webpack/lib/EvalSourceMapDevToolPlugin');


module.exports = function(options) {
    const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 3000;

    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
        host: HOST,
        port: PORT,
        ENV: ENV,
        HMR: helpers.hasProcessFlag('hot'),
        PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT
    });

    return webpackMerge(commonConfig({ env: ENV, metadata: METADATA  }), {

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkFilename: '[id].chunk.js',
            library: 'ac_[name]',
            libraryTarget: 'var'
        },

        plugins: [
            new EvalSourceMapDevToolPlugin({
                moduleFilenameTemplate: '[resource-path]',
                sourceRoot: 'webpack:///'
            }),

            new NamedModulesPlugin(),

            new LoaderOptionsPlugin({
                debug: true,
                options: { }
            })

        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            hot: METADATA.HMR,
            public: METADATA.PUBLIC,
            historyApiFallback: true,
            watchOptions: {
                // for Docker
                // aggregateTimeout: 300,
                // poll: 1000,
                ignored: /node_modules/
            },

            setup: function(app) {}
        },

        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
};
