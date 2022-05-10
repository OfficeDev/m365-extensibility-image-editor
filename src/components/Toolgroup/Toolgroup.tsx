// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';

import styles from './Toolgroup.module.scss';

type Props = {
    children?: React.ReactNode;
    width?: number;
};

export const Toolgroup: React.FC<Props> = ({ children, width }) => (
    <div className={styles.toolgroupContainer}>
        <Stack
            className={styles.buttonContainer}
            styles={{ root: { width: width } }}
        >
            {children}
        </Stack>
    </div>
);
