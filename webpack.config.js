const path = require("path");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const { NODE_ENV } = process.env;

module.exports = {
  entry: "./src/app.ts",
  mode: NODE_ENV,
  devtool: "inline-source-map",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new Dotenv(),
    new NodemonPlugin({
      watch: path.resolve("./dist"),
      script: "./dist/app.js",
    }),
  ],
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
  },
};
