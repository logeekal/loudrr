const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
module.exports = {
  entry: path.resolve(__dirname,"demo/index.tsx"),
  output: {
    path: path.resolve(__dirname, "demo/dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: "ts-loader",
        },
        resolve: {
          extensions: [".js", ".jsx",'.tsx','.ts'],
        },
      },
      {
        test: /\.(sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: "./demo/index.html",
    }),
  ],
};
