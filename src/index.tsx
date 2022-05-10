// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { initializeIcons } from '@fluentui/react';
import { initialize } from '@microsoft/teams-js';
import { createRoot } from 'react-dom/client';

import AppInitializer from './components/AppInitializer';

// Initializes teams-js sdk, must be called before other sdk calls
initialize();
// Initialize FluentUI Icons
initializeIcons(
    'https://static2.sharepointonline.com/files/fabric/assets/icons/',
);

// Render react app under the root container
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<AppInitializer />);
} else {
    console.log('Cannot find root element in html');
}
