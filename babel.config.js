// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//     // presets: ["babel-preset-expo"],
//     // plugins:['nativewind/babel']
//   };
// };

// module.exports = function (api) {
//   api.cache(true)
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//     plugins: [
//       "react-native-reanimated/plugin",
//       "@babel/plugin-proposal-export-namespace-from",
//     ],
//   }
// }

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from", // Move this up
      "react-native-reanimated/plugin", // Keep this as the last plugin
      // "expo-router/babel",
    ],
  };
};
