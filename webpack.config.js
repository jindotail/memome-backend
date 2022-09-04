const path = require("path");
const nodeExternals = require("webpack-node-externals");

const { NODE_ENV } = process.env;

module.exports = {
  entry: "./src/app.ts",
  mode: NODE_ENV,
  devtool: "inline-source-map",
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
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
  },
};
