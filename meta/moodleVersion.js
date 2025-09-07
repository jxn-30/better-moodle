// This is an implementation of https://github.com/jxn-30/better-moodle/issues/715

// Each comparison is to find a minimum version
const comparisons = {
    400: () =>
        new Promise(resolve =>
            require(['core/event'], e =>
                resolve(!!e.Events?.FORM_FIELD_VALIDATION))
        ),
    401: () =>
        new Promise(resolve =>
            require(['core/datafilter'], () => resolve(true), () =>
                resolve(false))
        ),
    402: () =>
        new Promise(resolve =>
            require(['core/modal_events'], events =>
                resolve('delete' in events))
        ),
    403: () =>
        new Promise(resolve =>
            require(['core/showmore'], () => resolve(true), () =>
                resolve(false))
        ),
    404: () =>
        new Promise(resolve =>
            require(['core/popper2'], () => resolve(true), () => resolve(false))
        ),
    405: () =>
        new Promise(resolve =>
            require(['core/fetch'], () => resolve(true), () => resolve(false))
        ),
    500: () =>
        new Promise(resolve =>
            require(['core/task_indicator'], () => resolve(true), () =>
                resolve(false))
        ),
};

(async () => {
    let instanceVersion = 0;
    for (const version in comparisons) {
        if (await comparisons[version]()) {
            instanceVersion = version;
        } else break;
    }
    console.log(instanceVersion);
})();
