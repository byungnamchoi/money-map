// `src/_includes/` 디렉토리에 있는 파일은 경로 없이 `import` 가능합니다.
// JS 파일은 esbuild로 번들링됩니다.
// 이때 파일명이 `.esm.js`로 끝나면 ES Module 형식으로 번들링되고 그 외의 경우 IIFE 형식으로 번들링됩니다.
import { consologo } from "consologo";

consologo();

function foo(param) {
  const { bar, ...rest } = param;
  return rest?.foo ?? "foo";
}

export function init() {
  foo({
    bar: "BAR",
    foo: "FOO",
  });
}
