const WebpackConfig = require('./lib/WebpackConfig');
const configGenerator = require('./lib/config-generator');
const validator = require('./lib/validate-config');
const PrettyError = require('pretty-error');
const commandConfig = require('./lib/command-config');

const webpackConfig = new WebpackConfig();

// determine the environment
let environment = commandConfig.environment;
if (environment === null) {
    environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
}
webpackConfig.setEnvironment(environment);

if (commandConfig.useDevServer) {
    // todo - allow URL to be passed in
    webpackConfig.useWebpackDevServer(commandConfig.devServerUrl);
}

module.exports = {
    /**
     * The directory where your files should be output.
     *
     * If relative (e.g. /web/build), it will be set relative
     * to the directory where your package.json lives.
     *
     * @param {string} outputPath
     * @return {exports}
     */
    setOutputPath(outputPath) {
        webpackConfig.setOutputPath(outputPath);

        return this;
    },

    /**
     * The public version of outputPath: the public path to outputPath.
     *
     * For example, if "web" is your document root, then:
     *      .setOutputPath('/web/build')
     *      .setPublicPath('/build')
     *
     * This can also be set to an absolute URL if you're using
     * a CDN: publicPath is used as the prefix to all asset paths
     * in the manifest.json file and internally in webpack:
     *      .setOutputPath('/web/build')
     *      .setPublicPath('https://coolcdn.com')
     *      // needed when public path is absolute
     *      .setManifestKeyPrefix('/build')
     *
     * @param {string} publicPath
     * @return {exports}
     */
    setPublicPath(publicPath) {
        webpackConfig.setPublicPath(publicPath);

        return this;
    },

    /**
     * Used as a prefix to the *keys* in manifest.json. Not usually needed.
     *
     * You don't normally need to set this. When you *do* need to set
     * it, an error will notify you.
     *
     * Typically, publicPath is used in the keys inside manifest.json.
     * But if publicPath is absolute, then we require you to set this.
     * For example:
     *
     *      .setOutputPath('/web/build')
     *      .setPublicPath('https://coolcdn.com/FOO')
     *      .setManifestKeyPrefix('/build')
     *
     * The manifest.json file would look something like this:
     *
     *      {
     *          "/build/main.js": "https://coolcdn.com/FOO/main.a54f3ccd2.js"
     *      }
     *
     * @param {string} manifestKeyPrefix
     * @return {exports}
     */
    setManifestKeyPrefix(manifestKeyPrefix) {
        webpackConfig.setManifestKeyPrefix(manifestKeyPrefix);

        return this;
    },

    /**
     * Advanced: manually set the webpack "context".
     *
     * This should only be necessary if you plan on running
     * webpack from a directory outside of your project.
     *
     * The context specifies the "root" path - all other
     * paths (e.g. used in addEntry()) are relative to
     * the context.
     *
     *      // webpack.config.js
     *      // guarantee the context is your root directory
     *      Encore.setContext(__dirname);
     *
     * @param {string} context
     * @return {exports}
     */
    setContext(context) {
        webpackConfig.setContext(context);

        return this;
    },

    addEntry(name, src) {
        webpackConfig.addEntry(name, src);

        return this;
    },

    addStyleEntry(name, src) {
        webpackConfig.addStyleEntry(name, src);

        return this;
    },

    /**
     * Call this to use the webpack-dev-server
     *
     * This will initialize the needed devServer config
     * and point the URLs to the webpackDevServerUrl
     * (http://localhost:8080 by default).
     *
     * Be sure to execute the webpack-dev-server when this
     * option is set:
     *
     *     ./node_modules/.bin/webpack-dev-server --hot --inline
     *
     * False can be passed as an argument to disable the dev server.
     *
     * @param {string|bool} webpackDevServerUrl
     * @return {exports}
     */
    useWebpackDevServer(webpackDevServerUrl = null) {
        webpackConfig.useWebpackDevServer(webpackDevServerUrl);

        return this;
    },

    enableVersioning(enabled = true) {
        webpackConfig.enableVersioning(enabled);

        return this;
    },

    enableSourceMaps(enabled = true) {
        webpackConfig.enableSourceMaps(enabled);

        return this;
    },

    /**
     * Add a "commons" file that holds JS shared by multiple chunks.
     *
     * @param {string} name The chunk name (e.g. vendor)
     * @param {Array}  files Array of files to put in the vendor entry
     * @return {exports}
     */
    createSharedEntry(name, files) {
        webpackConfig.createSharedEntry(name, files);

        return this;
    },

    /**
     * Automatically make some variables available everywhere!
     *
     * Usage:
     *
     *  WebpackConfig.autoProvideVariables({
     *      $: 'jquery',
     *      jQuery: 'jquery'
     *  });
     *
     *  Then, whenever $ or jQuery are found in any
     *  modules, webpack will automatically require
     *  the "jquery" module so that the variable is available.
     *
     *  This is useful for older packages, that might
     *  expect jQuery (or something else) to be a global variable.
     *
     * @param {Array} variables
     * @return {exports}
     */
    autoProvideVariables(variables) {
        webpackConfig.autoProvideVariables(variables);

        return this;
    },

    /**
     * Makes jQuery available everywhere. Equivalent to
     *
     *  WebpackConfig.autoProvideVariables({
     *      $: 'jquery',
     *      jQuery: 'jquery'
     *  });
     *
     * @return {exports}
     */
    autoProvidejQuery() {
        webpackConfig.autoProvidejQuery();

        return this;
    },

    /**
     * Enables the postcss-loader
     *
     * Once enabled, you must have a postcss.config.js config file.
     *
     * https://github.com/postcss/postcss-loader
     *
     * @param {boolean} enabled
     * @return {exports}
     */
    enablePostCssLoader(enabled = true) {
        webpackConfig.enablePostCssLoader(enabled);

        return this;
    },

    /**
     * Call this if you plan on loading SASS files.
     *
     * @param {boolean} enabled
     * @return {exports}
     */
    enableSassLoader(enabled = true) {
        webpackConfig.enableSassLoader(enabled);

        return this;
    },

    /**
     * Call this if you plan on loading less files.
     *
     * @param {boolean} enabled
     * @return {exports}
     */
    enableLessLoader(enabled = true) {
        webpackConfig.enableLessLoader(enabled);

        return this;
    },

    /**
     * Configure babel, without needing a .babelrc file.
     *
     * https://babeljs.io/docs/usage/babelrc/
     *
     * Encore.configureBabel(function(babelConfig) {
     *      // change the babelConfig
     * });
     *
     * @param {function} callback
     * @return {exports}
     */
    configureBabel(callback) {
        webpackConfig.configureBabel(callback);

        return this;
    },

    /**
     * Should the babel-loader be allowed to load config from
     * a .babelrc file?
     *
     * @param {boolean} shouldUse
     * @return {exports}
     */
    useBabelRcFile(shouldUse = true) {
        webpackConfig.useBabelRcFile(shouldUse);

        return this;
    },

    enableReactPreset(enabled = true) {
        webpackConfig.enableReactPreset(enabled);

        return this;
    },

    cleanupOutputBeforeBuild() {
        webpackConfig.cleanupOutputBeforeBuild();

        return this;
    },

    isProduction() {
        return webpackConfig.isProduction();
    },

    getWebpackConfig() {
        try {
            validator(webpackConfig);

            return configGenerator(webpackConfig);
        } catch (error) {
            // prettifies errors thrown by our library
            const pe = new PrettyError();
            pe.appendStyle({
                // hides the full paths below each stack item
                'pretty-error > trace': {
                    display: 'none'
                }
            });

            console.log(pe.render(error));
            process.exit(1); // eslint-disable-line
        }
    }
};
