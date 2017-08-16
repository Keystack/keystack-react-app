const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'www');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');


const scssLoader = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  { loader: 'sass-loader' }
];

const config = {
  entry : [
    path.join(__dirname, '/src/index-production.js')
  ],
  resolve: {
    extensions: [".js",".jsx","css","scss","sass"],
    modules: [
      'node_modules',
      //path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src')
    ]
  },
  devtool: 'source-map',
  output: {
    path: buildPath,
    filename: 'index.js',
  },

  plugins: [
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false        
      }
    }),
    // Moves files
    new TransferWebpackPlugin([
      {from: '../wwwDev'},
    ], path.resolve(__dirname, "src")),
  ],
  module: {
    rules: [
    {
      test: /\.jsx?$/,  
      loaders: ['babel-loader'], 
      exclude: [nodeModulesPath],
    },
    {
      test: /\.(scss|sass)$/,
      loader: scssLoader,
      include: [__dirname]
    },
    // { test: /\.css$/,
    //   loader: postcssLoader,
    //   include: [__dirname]
    // },
    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: [ 'file-loader' ]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader:'file-loader'
    },
    {
      test: /\.(webm|mp4)$/,
      loader: 'file-loader'
    },
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader:  "eslint-loader",
      options:{
        failOnError: false
      }
    }]
  }
};


module.exports = config;
