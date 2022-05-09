// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Retrieve AppId from env variable defined in .env files
export const AppId = typeof APP_ID !== 'undefined' ? APP_ID : '';

// Retrieve Graph scopes from env variables defined in .env files
export const graphScopes =
    typeof GRAPH_SCOPES !== 'undefined' ? GRAPH_SCOPES : [];
