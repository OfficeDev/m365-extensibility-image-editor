// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Icon } from '@fluentui/react';
import { MouseEventHandler } from 'react';

import styles from './Toolbutton.module.scss';

type Props = {
    iconName?: string;
    isActive?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    isDisabled?: boolean;
    title?: string;
    ariaLabel: string;
};

export const Toolbutton: React.FC<Props> = ({
    iconName,
    onClick,
    isActive,
    isDisabled,
    title,
    ariaLabel,
}) => {
    return (
        <DefaultButton
            className={`${isActive ? styles.buttonActive : undefined} ${
                isDisabled ? styles.buttonDisabled : styles.button
            }`}
            onClick={onClick}
            ariaLabel={ariaLabel}
            disabled={isDisabled}
            title={title}
        >
            <Icon iconName={iconName} className={styles.icon} />
        </DefaultButton>
    );
};
