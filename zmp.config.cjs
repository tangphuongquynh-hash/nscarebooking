// zmp.config.cjs - CommonJS copy so zmp CLI (which expects CJS) can read it
module.exports = {
  appType: 'react',
  sourceDir: 'src',
  outputDir: 'dist',
  appConfig: 'app-config.json',
  appManifest: 'manifest.json',
  index: 'index.html',
};
