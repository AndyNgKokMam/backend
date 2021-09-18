const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const context = path.resolve(__dirname, 'src')
// const context = path.resolve(__dirname);

var nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node', // ignore built-in modules like path, file, etc
    node: {
        __dirname: true // otherwise path gets confused. more @ https://webpack.js.org/configuration/node/#node-__dirname
    },
    externals: [nodeExternals()], // ignore modules in node_modules

    context,

    entry: {
        'backend-coding-test': ['babel-polyfill', path.resolve(__dirname, './index.ts')]
    },

    output: {
        path: path.resolve(__dirname, ''),
        filename: 'index.dist.js'
    },

    resolve: {
        // Look for modules in these places...
        modules: [
            path.resolve(__dirname, './node_modules'),
            path.resolve(__dirname, './core_modules'),
            path.resolve(__dirname, './src')
        ],

        // Settings so filename extension isn't required when importing.
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            // Typecript
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // Javascript
            {
                test: /\.(js)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader'
                        // options in .babelrc
                    }
                ]
            }
        ]
    },

    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    format: {
                        comments: /Copyright (c) AndyNg. All rights reserved./i
                    }
                },
                extractComments: true
            })
        ]
    }
}
