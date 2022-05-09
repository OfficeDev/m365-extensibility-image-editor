// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';

import styles from './LoadingPage.module.scss';

type Props = {
    title?: string;
    height?: string;
};

export const LoadingPage: React.FC<Props> = ({
    title,
    height,
}): JSX.Element => (
    <Stack
        style={{ height: height ?? '100vh' }}
        className={styles.container}
        tokens={{ childrenGap: 12 }}
    >
        <Spinner size={SpinnerSize.large} />
        <Text>{title}</Text>
    </Stack>
);
