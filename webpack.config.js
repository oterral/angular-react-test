module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg|jpeg|gif)$/,
                type: 'asset/resource'
            }
        ]
    },
    output: {
        assetModuleFilename: 'assets/map-img/[name][ext]'
    }
}
