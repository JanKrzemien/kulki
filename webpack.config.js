const path = require("path");
module.exports = {
  entry: {
    Plansza: "./src/Plansza.ts",
    Kulki: "./src/Kulka.ts",
    Interfaces: "./src/Interfaces.ts",
    Kat: "./src/Kat.ts",
    Timer: "./src/Timer.ts",
    Dekoratory: "./src/Dekoratory.ts",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  watch: true,
};
