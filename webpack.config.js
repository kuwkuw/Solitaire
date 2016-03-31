module.exports = {
    entry: "./app/app.js",
    output: {
        path: "./app/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};