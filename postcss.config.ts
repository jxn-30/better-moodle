import svgToMiniDataURI from 'mini-svg-data-uri';

export default {
    plugins: {
        'postcss-inline-svg': {
            /**
             * Takes a svg and returns it unchanged (encoding will happen during transform)
             * @param svg - the raw svg
             * @returns the raw svg
             */
            encode: (svg: string) => svg,
            /**
             * Takes a svg string, minifies it and converts it into a dataURI
             * @param svg - the raw svg to be converted
             * @returns a quoted dataURI
             */
            transform: (svg: string) => `"${svgToMiniDataURI(svg)}"`,
        },
        'postcss-preset-env': {},
    },
};
