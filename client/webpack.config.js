let mode = process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  mode: mode,

  module: {
    rules: [
      {
        test: /[(\.js)|(\.jsx)]$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
  },
};
