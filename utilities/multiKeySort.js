module.exports = sortOrderPreference => (a, b) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const sortPreference of sortOrderPreference) {
        const { key, direction = 'ascending', comparison = 'number' } = sortPreference;
        const x = direction === 'ascending' ? a : b;
        const y = direction === 'ascending' ? b : a;
        let result = 0;
        if (comparison === 'number') {
            result = x[key] - y[key];
        }
        if (comparison === 'string') {
            result = x[key].localeCompare(y[key]);
        }
        if (result) {
            return result;
        }
    }
    return 0;
};
