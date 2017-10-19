module.exports = function(config) {
  config.set({
    files: [
        'test/**/*.js',
        // Add your files here, this is just an example:
        {pattern: 'lib/**/*.js', mutated: true, included: false},
    ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    coverageAnalysis: 'perTest',
    reporter: ['clear-text', 'progress'],
    plugins: [
        'stryker-mocha-framework',
        'stryker-mocha-runner',
        'stryker-html-reporter',
    ],
  });
};
