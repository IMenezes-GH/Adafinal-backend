
/**
 * Parses 'true' or 'false' strings to Boolean
 * @param {string} str A string with expected 'true' or 'false' value
 * @returns {boolean}
 */
export const stringToBool = (str) => {
    if (!str || str === undefined) throw new Error('Cannot convert to Bool: A value is required.');

    const allowedStrings = ['true', 'false'];
    if (allowedStrings.includes(str.toLowerCase())){
        if (str === 'true') return true;
        if (str === 'false') return false;
    }
}