import svgToMiniDataURI from 'mini-svg-data-uri';

export default {
    plugins: {
        'postcss-inline-svg': {
            /**
             * @param svg
             */
            encode: (svg: string) => svg,
            /**
             * @param svg
             */
            transform: (svg: string) => `"${svgToMiniDataURI(svg)}"`,
        },
        'postcss-preset-env': {},
    },
};
