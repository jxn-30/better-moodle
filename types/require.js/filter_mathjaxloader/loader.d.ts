// These types fit for >= 500 only

interface Params {
    lang: string;
    mathjaxurl: string;
    mathjaxconfig: string;
}

export default interface MathJaxLoader {
    configure: (params: Params) => void;
    typeset: () => void;
    contentUpdated: (event: CustomEvent) => void;
    loadMathJax: () => Promise<Event>;
}
