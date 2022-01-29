const path = require("path");
const webpack = require('webpack')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
 // target: 'web',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    fallback: {
      "crypto": false,
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer")
    }
  },
  plugins: [
    new CopyWebpackPlugin(
      {patterns:[{ from: "./src/index.html", to: "index.html" }]}),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
     }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
  })
  ],
  devServer: { static: path.join(__dirname, "dist"), compress: true },
  
};
