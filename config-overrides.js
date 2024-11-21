// config-overrides.js
module.exports = function override(config, env) {
  // 예: CSS 모듈을 활성화하는 Webpack 설정 변경
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.test && rule.test.toString().includes("css")) {
      rule.use = rule.use.map((loader) => {
        if (loader.loader && loader.loader.includes("css-loader")) {
          loader.options.modules = true;
        }
        return loader;
      });
    }
    return rule;
  });

  return config;
};
