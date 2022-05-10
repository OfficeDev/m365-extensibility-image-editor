// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { initializeIcons } from '@fluentui/react';
import { File } from 'web-file-polyfill';

// this will get rid of all fluent warnings of unregistered icons
initializeIcons(
    'https://static2.sharepointonline.com/files/fabric/assets/icons/',
);

// Include polyfills here:

// This needs to be called to define the crypto object globally, which is used in msal 2.0
global.crypto = require('crypto');

global.atob = require('atob');

global.File = File;
