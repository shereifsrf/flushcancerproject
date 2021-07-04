const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { useBuiltIns: "usage", corejs: 3, targets: "> 0.25%, not dead" },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [isDev && ["react-refresh/babel"]].filter(Boolean),
};
