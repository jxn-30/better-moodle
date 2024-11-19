/**
 * @param version
 * @param other
 */
export const lt = (version: string, other: string) => {
    const [firstMajor, firstMinor, firstPatch] = version
        .split('.')
        .map(p => parseInt(p));
    const [otherMajor, otherMinor, otherPatch] = other
        .split('.')
        .map(p => parseInt(p));

    return (
        otherMajor > firstMajor || // major update
        (otherMajor === firstMajor && otherMinor > firstMinor) || // minor update
        (otherMajor === firstMajor && // patch update
            otherMinor === firstMinor &&
            otherPatch > firstPatch)
    );
};
