// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

'use strict';
module.exports = {
    roots: ['<rootDir>'],
    rootDir: '../..',
    //Handles TypeScript transpiling
    preset: 'ts-jest',
    //Location where it looks for files
    testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
    transform: {
        '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
        '^.+\\.tsx?$': 'ts-jest',
    },
    //Location where it looks for files
    coverageThreshold: {},
    coveragePathIgnorePatterns: ['tests/'],
    // direct analog to webpack's extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    setupFiles: ['<rootDir>/configs/jest/setup.ts', 'jest-canvas-mock'],
    moduleNameMapper: {
        '\\.(css|scss|png)$': '<rootDir>/configs/jest/emptyObject.ts',
    },
    globals: {
        IS_DEBUG: false,
    },
};
