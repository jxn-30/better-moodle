/**
 * Call a REST API function.
 * @param functionName - The REST API function name.
 * @param params - The parameters to pass to the REST API function.
 * @returns The parsed response from the REST API function.
 */
export const callRestFunction = async <T>(
    functionName: string,
    params: Record<string, unknown>
): Promise<T> => {
    if (!__MOODLE_APP_ENABLED__) {
        throw new Error(
            'The Moodle app is not enabled for this Moodle instance.'
        );
    }
    const token = GM_getValue<string | undefined>('wstoken');
    if (!token) {
        throw new Error(
            'No token found. Login again while better-moodle is active.'
        );
    } // TODO: show custom form in this case?
    return fetch('/webservice/rest/server.php', {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: functionName,
            moodlewsrestformat: 'json',
            ...params,
        }),
    })
        .then(resp => resp.json())
        .then((data: unknown): T => {
            if (isMoodleErrorResponse(data)) {
                throw new Error(
                    `${data.errorcode}: ${data.message} (${data.exception})`
                );
            }
            return data as T;
        });
};

interface MoodleErrorResponse {
    exception: string;
    errorcode: string;
    message: string;
}

/**
 * Checks whether the provided data matches the Moodle error response structure.
 * @param data - The unknown data to validate.
 * @returns True if the data is a MoodleErrorResponse; otherwise, false.
 */
function isMoodleErrorResponse(data: unknown): data is MoodleErrorResponse {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    return (
        'exception' in data &&
        typeof data.exception === 'string' &&
        'errorcode' in data &&
        typeof data.errorcode === 'string' &&
        'message' in data &&
        typeof data.message === 'string'
    );
}
