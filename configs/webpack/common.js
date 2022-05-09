// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// shared config (dev and prod)
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        fallback: {
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            querystring: require.resolve('querystring-es3'),
            url: require.resolve('url/'),
        },
    },
    context: resolve(__dirname, '../../src'),
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                //Support for scss/css modules
                test: /\.module.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                exportLocalsConvention: 'camelCaseOnly',
                            },
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, '../../public/index.html'),
            filename: 'index.html',
            inject: 'body',
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new MiniCssExtractPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: resolve(__dirname, '../../tsconfig.json'),
            },
        }),
    ],
};
