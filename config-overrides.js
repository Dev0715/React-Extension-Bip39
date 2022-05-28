const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = (config) => { 
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      return {
        ...rule,
        oneOf: [{ test: /\.wasm$/, type: 'webassembly/async' }, ...rule.oneOf],
      };
    }
    return rule;
  });
  const fallback = config.resolve.fallback || {}; 
  Object.assign(fallback, { 
    "crypto": require.resolve("crypto-browserify"), 
    "stream": require.resolve("stream-browserify"), 
    "assert": require.resolve("assert"), 
    "http": require.resolve("stream-http"), 
    "https": require.resolve("https-browserify"), 
    "os": require.resolve("os-browserify"), 
    "url": require.resolve("url") 
    }) 
  config.resolve.fallback = fallback; 
  config.plugins = (config.plugins || []).concat([ 
  new webpack.ProvidePlugin({ 
    process: 'process/browser', 
    Buffer: ['buffer', 'Buffer'] 
  }) 
  ])
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => !(plugin instanceof ModuleScopePlugin)
  );
  config.experiments = {
  asyncWebAssembly: true,
  };
  return config;
}
