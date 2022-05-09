// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Slider, Stack } from '@fluentui/react';
import { useCallback } from 'react';

import styles from './SizeSlider.module.scss';

export type Props = {
    isVisible?: boolean;
    defaultValue: number;
    updateContextSize: ((value: number) => void) | undefined;
};

export const SizeSlider: React.FC<Props> = ({
    isVisible,
    defaultValue,
    updateContextSize,
}): JSX.Element => {
    const onImageEditorSliderChange = useCallback(
        (value: number) => {
            updateContextSize && updateContextSize(value);
        },
        [updateContextSize],
    );

    return (
        <>
            {isVisible && (
                <Stack tokens={{ childrenGap: 10 }}>
                    <Slider
                        min={0}
                        max={50}
                        step={5}
                        className={styles.slider}
                        defaultValue={defaultValue}
                        onChange={onImageEditorSliderChange}
                    />
                </Stack>
            )}
        </>
    );
};
