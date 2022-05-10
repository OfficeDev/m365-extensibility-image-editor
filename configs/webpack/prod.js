// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

const commonConfig = require('./common');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

//Loads .env.local file and injects environment variables
dotenv.config({
    path: path.resolve(__dirname, '../../.env.prod'),
});

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: './index.tsx',
    output: {
        filename: 'js/bundle.[contenthash].min.js',
        path: resolve(__dirname, '../../dist'),
        publicPath: '/',
        clean: true,
    },
    devtool: 'source-map',
    plugins: [
        // Inject environmental variables during compile
        new webpack.DefinePlugin({
            IS_DEBUG: process.env.IS_DEBUG,
            APP_ID: JSON.stringify(process.env.APP_ID),
            GRAPH_SCOPES: process.env.GRAPH_SCOPES,
        }),
        // https://github.com/webpack-contrib/webpack-bundle-analyzer
        new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            // https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
            new CssMinimizerPlugin(),
            // https://webpack.js.org/plugins/terser-webpack-plugin/
            new TerserPlugin(),
            // https://webpack.js.org/plugins/compression-webpack-plugin/
            new CompressionPlugin(),
        ],
        splitChunks: {
            chunks: 'all',
        },
    },
});
