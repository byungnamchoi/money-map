const path = require("node:path");

const BUILD_MODE = process.env.ELEVENTY_RUN_MODE === "build";
const ROOT = path.resolve(__dirname, "..");
const SRC = path.resolve(ROOT, "src");
const INCLUDES = path.resolve(SRC, "_includes");

const sass = require("sass");
const postcss = require("postcss");
const postcssrc = require("postcss-load-config");
const prettier = require("prettier");

const { hasLeadingUnderscore } = require("./util/path.cjs");

/**
 * `.scss` 파일은 CSS 파일로 변환하고 생성된 모든 CSS 파일을 PostCSS로 처리합니다.
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats(["css", "scss"]);

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (hasLeadingUnderscore(inputPath)) {
        return;
      }

      return async () => inputContent;
    },
  });
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (hasLeadingUnderscore(inputPath)) {
        return;
      }

      const { dir } = path.parse(inputPath);

      return async () => {
        const { css } = await sass
          .compileStringAsync(inputContent, {
            loadPaths: [dir || ".", INCLUDES],
          })
          .catch((error) => {
            if (error.sassMessage) {
              process.stderr.write(error.sassMessage);
            } else {
              throw error;
            }
          });

        return css;
      };
    },
  });

  eleventyConfig.addTransform("postcss", async function (content) {
    const { inputPath, outputPath, outputFileExtension } = this.page;

    if (!outputPath) {
      return content;
    }

    if (outputFileExtension !== "css") {
      return content;
    }

    const { plugins, options } = await postcssrc();
    const css = await postcss(plugins)
      .process(content, {
        ...options,
        from: inputPath,
        to: outputPath,
      })
      .then((result) => result.css);

    if (BUILD_MODE) {
      return prettier.format(css, {
        parser: "css",
      });
    }

    return css;
  });
};
