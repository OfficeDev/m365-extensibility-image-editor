// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommandBarButton } from '@fluentui/react';

import styles from './SelectMenu.module.scss';

type Props = {
    onCrop?: () => void;
    onCut?: () => void;
    onCopy?: () => void;
    onResize?: () => void;
    top: number;
    left: number;
    hidden: boolean;
};

export const SelectMenu: React.FC<Props> = ({
    onCrop,
    onCut,
    onCopy,
    onResize,
    top,
    left,
    hidden,
}): JSX.Element => (
    <div
        style={{
            top: top,
            left: left,
        }}
        className={styles.menu}
        hidden={hidden}
    >
        <CommandBarButton
            className={styles.button}
            text="Crop"
            iconProps={{ iconName: 'Crop' }}
            onClick={onCrop}
            aria-label={'Crop selection'}
        />
        <br />
        <CommandBarButton
            className={styles.button}
            text="Cut"
            iconProps={{ iconName: 'Cut' }}
            onClick={onCut}
            aria-label={'Cut selection'}
        />
        <br />
        <CommandBarButton
            className={styles.button}
            text="Copy"
            iconProps={{ iconName: 'Copy' }}
            onClick={onCopy}
            aria-label={'Copy selection'}
        />
        <br />
        <CommandBarButton
            className={styles.button}
            text="Re-size"
            iconProps={{ iconName: 'PictureStretch' }}
            onClick={onResize}
            aria-label={'Resize selection'}
        />
    </div>
);
