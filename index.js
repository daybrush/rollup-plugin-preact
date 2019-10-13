const resolve = require("rollup-plugin-node-resolve");

function preact(options = {}) {

    const aliasModules = options.aliasModules || {};
    const resolvePlugin = resolve(options);
    const customResolvePlugin = {
        ...resolvePlugin,
        resolveId(importee, importer) {
            if (
                importee === "react"
                || importee === "react-dom"
            ) {
                const moduleName = options.usePreactX ? "preact/compat" : "preact-compat";

                return (options.resolvePreactCompat || options.usePreactX)
                    ? resolvePlugin.resolveId(moduleName, importer)
                    : moduleName;
            }
            if (importee === "prop-types" && options.noPropTypes) {
                return resolvePlugin.resolveId(__dirname + "/compat/prop-types.js", importer);
            }
            if (importee === "react-is" && options.noReactIs) {
                return resolvePlugin.resolveId(__dirname + "/compat/react-is.js", importer);
            }
            if (aliasModules[importee]) {
                return aliasModules[importee];
            }
            return resolvePlugin.resolveId(importee, importer);
        },
        intro: function intro() {
            return options && options.noEnv ? `var process = { env: {NODE_ENV: "production"} };` : "";
        },
    }
    return customResolvePlugin;
}


module.exports = preact;
