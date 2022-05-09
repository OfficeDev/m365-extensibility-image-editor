// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Link, PrimaryButton, Stack } from '@fluentui/react';
import {
    AuthProviderCallback,
    Client,
} from '@microsoft/microsoft-graph-client';
import {
    appInitialization,
    getContext,
    registerOnThemeChangeHandler,
} from '@microsoft/teams-js';
import { useEffect, useState } from 'react';

import { createAuthProvider, ImageEditorAuthProvider } from '../auth/auth';
import { graphScopes } from '../constants/ImageEditorAppConstants';
import { App } from './App';
import styles from './AppInitializer.module.scss';
import { LoadingPage } from './LoadingPage/LoadingPage';
import { ServiceProviderContext } from './ServiceProviderContext/ServiceProviderContext';

enum LoadingState {
    Unauthenticated,
    Authing,
    Loading,
    Loaded,
    Error,
}

type LoadingStateContainer =
    | {
          state: LoadingState.Unauthenticated;
          authProvider: ImageEditorAuthProvider;
      }
    | {
          state: LoadingState.Authing;
          authProvider: ImageEditorAuthProvider;
      }
    | {
          state: LoadingState.Loading;
          authProvider: ImageEditorAuthProvider;
      }
    | {
          state: LoadingState.Loaded;
          authProvider?: ImageEditorAuthProvider;
          graph?: Client;
      }
    | {
          state: LoadingState.Error;
          authProvider: ImageEditorAuthProvider;
          error: Error;
      };

// App Initializer handles auth and theming setup and is the entrypoint to app render.
// Load App.tsx as soon as initialization is finished
const AppInitializer: React.FC = (): JSX.Element => {
    // Loading state is used like a state machine here, and will determine if
    // the page will ask the user to sign in, show the app, show an error, or
    // show a loading spinner
    const [loadingState, setLoadingState] = useState<LoadingStateContainer>({
        state: LoadingState.Authing,
        authProvider: createAuthProvider(),
    });

    const [theme, setTheme] = useState<string>('light-theme');

    const onSignIn = async (authProvider: ImageEditorAuthProvider) => {
        try {
            await authProvider.login();
            setLoadingState({ state: LoadingState.Loading, authProvider });
        } catch (error) {
            if (error instanceof Error) {
                setLoadingState({
                    state: LoadingState.Error,
                    error,
                    authProvider,
                });
            }
        }
    };

    useEffect(() => {
        const trySilentLogin = async (
            authProvider: ImageEditorAuthProvider,
        ) => {
            try {
                await authProvider.getCachedToken();
                setLoadingState({ state: LoadingState.Loading, authProvider });
            } catch {
                // Silent-auth failed, move to unauthenticated state and wait until user clicks sign in
                setLoadingState({
                    state: LoadingState.Unauthenticated,
                    authProvider,
                });
            }
        };

        const loadAsync = async (authProvider: ImageEditorAuthProvider) => {
            try {
                const graphService = await initGraphAsync(authProvider);
                appInitialization.notifyAppLoaded();
                appInitialization.notifySuccess();
                setLoadingState({
                    state: LoadingState.Loaded,
                    authProvider: authProvider,
                    graph: graphService,
                });
            } catch (error) {
                if (error instanceof Error) {
                    setLoadingState({
                        state: LoadingState.Error,
                        error,
                        authProvider,
                    });
                }
            }
        };

        switch (loadingState.state) {
            case LoadingState.Authing:
                trySilentLogin(loadingState.authProvider);
                break;
            case LoadingState.Loading:
                loadAsync(loadingState.authProvider);
                break;
        }
    }, [loadingState]);

    // Set theme
    useEffect(() => {
        // allow theme overrides with search params
        new URL(location.href).searchParams.get('theme');
        const params = new URL(location.href).searchParams;
        const themeOverride = params.get('theme');
        // sdk theme strings include 'light', 'dark', and 'contrast'
        // use these strings and this callback to set the theme on your app
        // to test these changes, switch the theme in a hosted app like teams, in app settings
        const handleThemeChange = (theme: string) => {
            switch (theme) {
                case 'dark':
                    setTheme('dark-theme');
                    break;
                case 'contrast':
                    setTheme('high-contrast-theme');
                    break;
                // light theme
                default:
                    setTheme('light-theme');
                    break;
            }
        };
        if (themeOverride) {
            handleThemeChange(themeOverride);
        } else {
            // get theme from SDK
            getContext((context) => {
                registerOnThemeChangeHandler(handleThemeChange);
                context.theme && handleThemeChange(context.theme);
            });
        }
    }, []);

    const loadWithoutOnedrive = () => {
        setLoadingState({
            state: LoadingState.Loaded,
            authProvider: undefined,
            graph: undefined,
        });
    };

    return (
        <div
            id="imageEditor-theme-container"
            className={`${theme} ${styles.container}`}
        >
            {loadingState.state === LoadingState.Unauthenticated && (
                <Stack className={styles.authing} tokens={{ childrenGap: 12 }}>
                    <Stack.Item>
                        <PrimaryButton
                            text={'Sign in'}
                            onClick={() => onSignIn(loadingState.authProvider)}
                        />
                    </Stack.Item>
                    <Stack.Item className={styles.skip}>
                        <Link onClick={loadWithoutOnedrive}>
                            Skip sign in without cloud storage functionality
                        </Link>
                    </Stack.Item>
                </Stack>
            )}
            {(loadingState.state === LoadingState.Authing ||
                loadingState.state === LoadingState.Loading) && (
                <LoadingPage title="Loading" />
            )}
            {loadingState.state === LoadingState.Loaded && (
                <ServiceProviderContext.Provider
                    value={{
                        graphClient: loadingState.graph,
                    }}
                >
                    <App />
                </ServiceProviderContext.Provider>
            )}
            {loadingState.state === LoadingState.Error && (
                <Stack className={styles.error} tokens={{ childrenGap: 12 }}>
                    <Stack.Item grow={false}>
                        {IS_DEBUG
                            ? `Loading error: ${loadingState.error.message}`
                            : 'Authentication failed. Please try again or skip.'}
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton
                            text={'Sign in'}
                            onClick={() => onSignIn(loadingState.authProvider)}
                        />
                    </Stack.Item>
                    <Stack.Item className={styles.skip}>
                        <Link onClick={loadWithoutOnedrive}>
                            Skip sign in without cloud functionality
                        </Link>
                    </Stack.Item>
                </Stack>
            )}
        </div>
    );
};

const initGraphAsync = async (
    authProvider: ImageEditorAuthProvider,
): Promise<Client> => {
    const getTokenAsync = async (): Promise<string> => {
        return authProvider.getAccessToken({
            scopes: graphScopes,
        });
    };
    const token = await getTokenAsync();
    const graphService = await Client.init({
        authProvider: (done: AuthProviderCallback) => {
            done(null, token);
        },
    });

    return graphService;
};

export default AppInitializer;
