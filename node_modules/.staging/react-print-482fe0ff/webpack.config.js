var path = require('path'),
    webpack = require('webpack');

var PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

module.exports = {
    entry: path.join(PATHS.src, "PrintTemplate.jsx"),
    output: {
        path: PATHS.build,
        filename: 'react-print.min.js',
        library: 'PrintTemplate',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    externals: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["add-module-exports"]
                }
            },
            {
                test: /\.css$/, loader: "style-loader!css-loader"
            }
        ]
    },
    watch: true
};
