const path = require("node:path/posix");
const BUILD_MODE = process.env.ELEVENTY_RUN_MODE === "build";

const posthtml = require("posthtml");
const posthtmlPostcss = require("posthtml-postcss");
const posthtmlEsbuild = require("./posthtml-esbuild.cjs");
const posthtmlRelativePath = require("./posthtml-relative-path.cjs");
const prettier = require("prettier");

/**
 * 생성되는 모든 HTML 파일을 PostHTML로 후처리합니다.
 *
 * - `<style>` 태그의 내용을 PostCSS로 후처리합니다.
 * - `<script>` 태그의 내용을 esbuild로 트랜스파일합니다.
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTransform("posthtml", async function (content) {
    const { outputPath, outputFileExtension } = this.page;

    if (!outputPath) {
      return content;
    }

    if (outputFileExtension !== "html") {
      return content;
    }

    const posthtmlPlugins = [
      posthtmlPostcss(),
      posthtmlEsbuild(),
      posthtmlRelativePath({
        pathPrefix: path.normalize(eleventyConfig.pathPrefix + "/"),
      }),
    ];
    const html = await posthtml(posthtmlPlugins)
      .process(content)
      .then((result) => result.html);

    if (BUILD_MODE) {
      return prettier.format(html, {
        parser: "html",
      });
    }

    return html;
  });
};
