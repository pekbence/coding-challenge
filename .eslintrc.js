module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4],
        'max-len': ['error', 120],
        'object-curly-newline': ['error', {
            ObjectPattern: { multiline: false },

        }],
        'arrow-parens': ['error', 'as-needed'],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
    },
    plugins: ['jest'],
};
