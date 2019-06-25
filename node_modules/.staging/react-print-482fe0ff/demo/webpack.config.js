var path = require('path'),
    webpack = require('webpack');

var PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

module.exports = {
    entry: path.join(PATHS.src, "index.jsx"),
    output: {
        path: PATHS.build,
        filename: 'demo.min.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/, loader: "style-loader!css-loader"
            }
        ]
    },
    watch: true
};
