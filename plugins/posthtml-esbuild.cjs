const browserslist = require("browserslist");
const esbuild = require("esbuild");
const { resolveToEsbuildTarget } = require("esbuild-plugin-browserslist");
const esbuildTarget = resolveToEsbuildTarget(browserslist(), {
  printUnknownTargets: false,
});

/**
 * HTML 내 `<script>` 태그의 내용을 esbuild로 트랜스파일합니다.
 *
 * @param {{target: string, format: "esm" | "iife"}} options
 * @returns {import("posthtml").Plugin}
 */
module.exports = function (options = {}) {
  return function posthtmlEsbuild(tree) {
    const promises = [];

    tree.match({ tag: "script" }, function (node) {
      const { attrs, content } = node;

      if (attrs?.src || !content) {
        return node;
      }

      const esbuildOptions = {
        loader: "js",
        target: options.target || esbuildTarget,
      };

      if (attrs?.type === "module") {
        esbuildOptions.format = "esm";
      } else if (options.format) {
        esbuildOptions.format = options.format;
      }

      promises.push(
        esbuild.transform(content.join(""), esbuildOptions).then(({ code }) => {
          node.content = [code];
        }),
      );

      return node;
    });

    if (promises.length) {
      return Promise.all(promises).then(() => tree);
    }

    return tree;
  };
};
