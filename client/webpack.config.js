const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const mode = process.env.NODE_ENV || "development";
const serverUrl = process.env.SERVER_URL;

module.exports = (env, options) => {
  const isDev = mode.trim() !== "production";

  let plugins = [
    new Dotenv(),
    // new webpack.DefinePlugin({
    //   "process.env": {
    //     // defaults the environment to development if not specified
    //     NODE_ENV: JSON.stringify(mode),
    //     SERVER_URL: JSON.stringify(serverUrl),
    //   },
    // }),
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ];

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  return {
    mode,
    target: "web",
    entry: "./src/index.js",

    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      assetModuleFilename: "images/[hash][ext][query]",
    },

    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset",
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    stats: { errorDetails: true },
    performance: {
      hints: false,
    },

    plugins,

    resolve: {
      alias: {
        Api: path.resolve(__dirname, "src/api"),
      },
      extensions: [".js", ".jsx"],
    },

    devtool: "source-map",
    devServer: {
      contentBase: "./dist",
      historyApiFallback: {
        disableDotRule: true,
      },
    },
  };
};
