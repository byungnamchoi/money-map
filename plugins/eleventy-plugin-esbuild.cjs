const path = require("node:path");
const browserslist = require("browserslist");
const esbuild = require("esbuild");
const { resolveToEsbuildTarget } = require("esbuild-plugin-browserslist");

const esbuildTarget = resolveToEsbuildTarget(browserslist(), {
  printUnknownTargets: false,
});
const { hasLeadingUnderscore } = require("./util/path.cjs");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.resolve(ROOT, "src");
const INCLUDES = path.resolve(SRC, "_includes");

/**
 * @param {string} format
 * @param {string} inputPath
 * @returns {"esm" | "iife"}
 */
const decideFormat = (format, inputPath) => {
  if (typeof format === "string" && ["esm", "iife"].includes(format)) {
    return format;
  }
  const { name } = path.parse(inputPath);
  return name.endsWith(".esm") ? "esm" : "iife";
};

/**
 * @typedef {object} BundleOptions
 * @property {string} [target]
 * @property {"esm" | "iife"} [format]
 */

/**
 * @param {string} inputPath
 * @param {BundleOptions} [options]
 * @returns {Promise<string>}
 */
async function bundle(inputPath, options = {}) {
  const { outputFiles, errors, warnings } = await esbuild.build({
    nodePaths: [INCLUDES],
    entryPoints: [inputPath],
    bundle: true,
    target: options.target || esbuildTarget,
    format: decideFormat(options.format, inputPath),
    write: false,
  });

  errors.forEach((error) => {
    process.stderr.write(error.text);
  });
  warnings.forEach((warning) => {
    process.stderr.write(warning.text);
  });

  return outputFiles[0].text;
}

/**
 * JS 파일을 esbuild로 번들링합니다.
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {BundleOptions} options
 */
module.exports = (eleventyConfig, options = {}) => {
  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",
    compile: async function (inputContent, inputPath) {
      if (hasLeadingUnderscore(inputPath)) {
        return;
      }

      return async () => {
        return await bundle(inputPath, options);
      };
    },
  });
};

module.exports.bundle = bundle;
