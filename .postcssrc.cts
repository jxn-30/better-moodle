const svgToMiniDataURI = require('mini-svg-data-uri');

/** @type {import('postcss-load-config').Config} */
module.exports = {
    plugins: {
        'postcss-inline-svg': {
            /**
             * @param svg
             */
            encode: (svg: string) => svg,
            transform: (svg: string) => `"${svgToMiniDataURI(svg)}"`,
        },
        'postcss-preset-env': {},
    },
};
