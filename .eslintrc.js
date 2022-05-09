module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
    ],
    plugins: [
        'jsx-a11y',
        'react-hooks',
        'simple-import-sort',
        'prettier',
        'import',
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    env: {
        browser: true,
        amd: true,
        node: true,
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/anchor-is-valid': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        'jsx-a11y/no-noninteractive-tabindex': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'prefer-arrow-callback': 'error',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'off',
        'simple-import-sort/sort': 'error',
        'sort-imports': 'off',
        'prettier/prettier': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        '@typescript-eslint/no-unused-vars': [
            1,
            { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ], // allow unused var if preceded with an underscore
        'no-restricted-imports': [
            'error',
            {
                patterns: ['../**/dist'],
            },
        ],
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
        {
            files: ['*.test.tsx'],
            rules: {
                'react/display-name': 'off',
            },
        },
        {
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/ban-types': [
                    'error',
                    {
                        extendDefaults: true,
                        types: {
                            object: false,
                            '{}': false,
                        },
                    },
                ],
            },
        },
    ],
};
