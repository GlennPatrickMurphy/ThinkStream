const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts

module.exports = {
  resolver: {
    sourceExts: process.env.RN_SRC_EXT ? process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts) : defaultSourceExts
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};


console.log("module.exports:" + module.exports.resolver.sourceExts);
console.log('If "e2e.js" appears in the list, mock files will be run. Make sure there are no whitespaces before/after "e2e.js".');
