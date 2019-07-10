const resolve = require("rollup-plugin-node-resolve");

function preact(options) {
    const resolvePlugin = resolve(options);
    const customResolvePlugin = {
        ...resolvePlugin,
        resolveId(importee, importer) {
            if (importee === "react" || importee === "react-dom") {
                return resolvePlugin.resolveId("preact-compat/dist/preact-compat.es.js", importer);
            }
            if (importee === "prop-types" && options && options.noPropTypes) {
                return resolvePlugin.resolveId(__dirname + "/compat/prop-types.js", importer);
            }
            if (importee === "react-is" && options && options.noReactIs) {
                return resolvePlugin.resolveId(__dirname + "/compat/react-is.js", importer);
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
