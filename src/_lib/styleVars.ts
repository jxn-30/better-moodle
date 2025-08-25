import styleVars from '!/variables.module.scss';

export const breakpoints = Object.fromEntries(
    (JSON.parse(styleVars.gridBreakpoints) as string).split(';').map(i => {
        const [key, val] = i.split(':');
        return [key.trim(), parseFloat(val)] as const;
    })
);
