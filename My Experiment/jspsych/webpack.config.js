const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './experiment.js', // The entry point is our main jsPsych file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  mode: 'development',
  plugins: [
    new CopyPlugin({
      patterns: [
        // This copies our game and main HTML file to the output directory
        { from: "exobound_game.html", to: "exobound_game.html" },
        { from: "experimental.html", to: "experimental.html" }
      ],
    }),
  ],
  // This section tells Webpack how to handle different file types
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  // This fixes the 'path' module error
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};
