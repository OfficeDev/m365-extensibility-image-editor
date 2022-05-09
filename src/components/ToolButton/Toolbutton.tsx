// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Icon } from '@fluentui/react';
import { MouseEventHandler } from 'react';

import styles from './Toolbutton.module.scss';

type Props = {
    iconName?: string;
    isActive?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    ariaLabel: string;
};

export const Toolbutton: React.FC<Props> = ({
    iconName,
    onClick,
    isActive,
    ariaLabel,
}) => {
    return (
        <DefaultButton
            className={`${styles.button} ${
                isActive ? styles.buttonActive : undefined
            }`}
            onClick={onClick}
            ariaLabel={ariaLabel}
        >
            <Icon iconName={iconName} className={styles.icon} />
        </DefaultButton>
    );
};
