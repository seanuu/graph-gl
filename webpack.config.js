const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, 'index.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        globalObject: 'this',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.worker\.js$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {inline: true, fallback: false}
                    },
                    'babel-loader'
                ]
            },
        ]
    },
    optimization: {
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};
