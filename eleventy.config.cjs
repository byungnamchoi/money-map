const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const relativePathPlugin = require("./plugins/eleventy-plugin-relative-path.cjs");
const esbuildPlugin = require("./plugins/eleventy-plugin-esbuild.cjs");
const posthtmlPlugin = require("./plugins/eleventy-plugin-posthtml.cjs");
const stylePlugin = require("./plugins/eleventy-plugin-style.cjs");
const noIndexPermalinkPlugin = require("./plugins/eleventy-plugin-no-index-permalink.cjs");
const { hasLeadingUnderscore } = require("./plugins/util/path.cjs");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(relativePathPlugin);
  eleventyConfig.addPlugin(esbuildPlugin);
  eleventyConfig.addPlugin(posthtmlPlugin);
  eleventyConfig.addPlugin(stylePlugin);
  eleventyConfig.addPlugin(noIndexPermalinkPlugin);

  // Layout Alias
  eleventyConfig.addLayoutAlias("default", "default.liquid");

  // Collections
  eleventyConfig.addCollection("view", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/**/*.html")
      .filter(
        (item) => item.page && !hasLeadingUnderscore(item.page.inputPath),
      ),
  );

  eleventyConfig.setServerOptions({
    // 기본 8080 포트 사용 불가로 오류 발생 시 3000, 3030 등 다른 포트로 변경
    // port: 3000,
    showAllHosts: true,
  });

  // 추가 처리 없이 복사할 파일들
  // See https://www.11ty.dev/docs/copy/
  const EXTs = {
    IMAGES: ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"],
    VIDEOS: ["mp4", "webm"],
    FONTS: ["woff", "woff2"],
    DATA: ["json", "xml", "webmanifest"],
    MISC: ["map"],
    toString() {
      const all = Object.entries(this).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc.push(...value);
        }

        return acc;
      }, []);
      return all.join(",");
    },
  };
  eleventyConfig.addPassthroughCopy(`src/**/*.{${EXTs}}`, {
    overwrite: true,
  });
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    pathPrefix: "",
    dir: {
      layouts: "_layouts",
      input: "src",
      output: "dist",
    },
  };
};
