const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'www');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');


const config = {
  //Entry points to the project
  entry : path.join(__dirname, '/src/index.js'),
  //Config options on how to interpret requires imports
  resolve: {
    extensions: [".js"],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'index.js',  //Name of output file
  },
  //Server Configuration options
  devServer:{
    contentBase: 'wwwDev',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    port: 3010,        //Port Number
    host: '0.0.0.0',  //Change to '0.0.0.0' for external facing server
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: 'index.js',
  },
  plugins: [
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false,
      },
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoEmitOnErrorsPlugin(),
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Moves files
    new TransferWebpackPlugin([
      {from: '../wwwDev'},
    ], path.resolve(__dirname, "src")),
  ],
  module: {
    rules: [{
        test: /\.less$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "less-loader", options: {
                strictMath: true,
                noIeCompat: true
            }
        }]
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["es2016", "react"],
        }
      }
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' 
    },
    {
      //React-hot loader and
      test: /\.jsx?$/,  //All .js files
      loaders: ['react-hot-loader', 'babel-loader'], //react-hot is like browser sync and babel loads jsx and es6-7
      exclude: [nodeModulesPath],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader:'file'
    },
    {
      test: /\.(webm|mp4)$/,
      loader: 'file'
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
