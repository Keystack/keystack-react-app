const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'www');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const postcssPlugins = [
  require('postcss-cssnext')(),
  require('postcss-modules-values')
];

const scssLoader = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  { loader: 'sass-loader' }
];

const postcssLoader = [
  { loader: 'style-loader' },
  { loader: 'css-loader', options: { modules: true } },
  { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
];

const config = {
  entry : path.join(__dirname, '/src/index.js'),
  resolve: {
    extensions: [".js",".jsx","css","scss","sass"],
    modules: [
      path.resolve(__dirname, 'node_modules'),
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
      mangle: true,
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }),    
    // Moves files
    new TransferWebpackPlugin([
      {from: '../wwwDev'},
    ], path.resolve(__dirname, "src")),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
    }),
  ],
  module: {
    rules: [
    {
      test: /\.(scss|sass)$/,
      loader: scssLoader,
      include: [__dirname]
    },
    { test: /\.css$/,
      loader: postcssLoader,
      include: [__dirname]
    },
    {
      test: /\.jsx?$/,  
      loaders: ['react-hot-loader', 'babel-loader'], 
      exclude: [nodeModulesPath],
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
