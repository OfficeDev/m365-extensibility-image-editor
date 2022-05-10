// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Client } from '@microsoft/microsoft-graph-client';
import { createContext } from 'react';

type ServiceProviderContextType = {
    graphClient?: Client;
};

export const ServiceProviderContext = createContext<ServiceProviderContextType>(
    {},
);
