const path = require('path');
const dist = path.resolve('./dist');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const cssExtract = new ExtractTextPlugin('css/base.css');

module.exports = {
    devtool: 'source-map',
    entry: {
        'js/autocomplete/autocomplete.js': './assets/components/autocomplete/autocomplete.js',
        'css/base.css': './assets/sass/base.scss'
    },
    output: {
        path: path.resolve(dist),
        filename: '[name]'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss/,
                include: /base\.scss/,
                loader: cssExtract.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.svg/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        ]

    },
    plugins: [
        new CopyPlugin([
            {from: './assets/images/', to: 'images'},
            {from: './assets/views/', to: './'}
        ]),
        cssExtract
    ]
};
