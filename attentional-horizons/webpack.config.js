const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // The entry point of our application. Webpack will start from this file.
  entry: './src/main.js',
  
  // The output configuration.
  output: {
    // The name of the bundled file.
    filename: 'game.bundle.js',
    // The absolute path to the output directory.
    path: path.resolve(__dirname, 'dist'),
    // Clean the output directory before each build.
    clean: true,
  },
  
  // Module rules for processing different file types.
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
  
  // Plugins to extend Webpack's functionality.
  plugins: [
    // Copy static files from the 'src' directory to the 'dist' directory.
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html' },
        { from: 'assets', to: 'assets' },
        { from: 'node_modules/phaser/dist/phaser.min.js', to: 'phaser.min.js' },
        { from: 'node_modules/jspsych/dist/jspsych.js', to: 'jspsych.js' },
        { from: 'node_modules/jspsych/dist/jspsych.css', to: 'jspsych.css' },
      ],
    }),
  ],
  
  // Development server configuration.
  devServer: {
    // The directory to serve files from.
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // Enable compression.
    compress: true,
    // The port to run the server on.
    port: 8080,
    // Open the browser automatically when the server starts.
    open: true,
  },
  
  // Controls how source maps are generated.
  devtool: 'eval-source-map',
};
