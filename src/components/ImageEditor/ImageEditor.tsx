// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createRef, MouseEventHandler, useCallback, useState } from 'react';

import { SelectMenu } from '../SelectMenu/SelectMenu';
import styles from './ImageEditor.module.scss';

type Props = {
    imageSrc: string;
    isImageEditing: boolean;
    width: number;
    height: number;
    setIsMoving: React.Dispatch<React.SetStateAction<boolean>>;
    setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
    imageTop: number;
    imageLeft: number;
    imageRefPlot: React.RefObject<HTMLImageElement>;
    onImageMouseMove: MouseEventHandler<HTMLDivElement>;
    onImageMouseUp: MouseEventHandler<HTMLDivElement>;
    onResizeMouseMove: MouseEventHandler<HTMLDivElement>;
    onResizeMouseUp: MouseEventHandler<HTMLDivElement>;
    onCropCanvas: () => void;
    onImageEditingStateChange: (isImageEditing: boolean) => void;
    isSelectMenuVisible: boolean;
    selectMenuTop: number;
    selectMenuLeft: number;
    onSelectionMenuClicked: (isVisible: boolean) => void;
    setImageDimensions: (width: number, height: number) => void;
};

export const ImageEditor: React.FC<Props> = ({
    imageSrc,
    isImageEditing,
    width,
    height,
    setIsMoving,
    setIsResizing,
    imageTop,
    imageLeft,
    imageRefPlot,
    onImageMouseMove,
    onImageMouseUp,
    onResizeMouseMove,
    onResizeMouseUp,
    onCropCanvas,
    onImageEditingStateChange,
    isSelectMenuVisible,
    selectMenuTop,
    selectMenuLeft,
    onSelectionMenuClicked,
    setImageDimensions,
}): JSX.Element => {
    const imageRef = createRef<HTMLImageElement>();

    const [hideResizeButtons, setHideResizeButtons] = useState(true);

    const onSizeChange = useCallback(() => {
        imageRef.current &&
            setImageDimensions(
                imageRef.current.naturalWidth,
                imageRef.current.naturalHeight,
            );
    }, [imageRef, setImageDimensions]);

    const onMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            onSelectionMenuClicked(false);
            setIsMoving(false);
            setIsResizing(true);
        },
        [setIsMoving, setIsResizing, onSelectionMenuClicked],
    );

    const onImageMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            onSelectionMenuClicked(false);
            setIsResizing(false);
            setIsMoving(true);
        },
        [setIsMoving, setIsResizing, onSelectionMenuClicked],
    );

    const onCrop = useCallback(() => {
        onSelectionMenuClicked(true);
        onCropCanvas();
    }, [onCropCanvas, onSelectionMenuClicked]);

    const onCopy = useCallback(async () => {
        onSelectionMenuClicked(true);
        try {
            const imageURL = imageSrc;
            const data = await fetch(imageURL);
            const blob = await data.blob();

            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob,
                }),
            ]);
        } catch (error) {
            console.error(error);
        }
    }, [imageSrc, onSelectionMenuClicked]);

    const onCut = useCallback(() => {
        onCopy();
        onImageEditingStateChange(false);
    }, [onCopy, onImageEditingStateChange]);

    const onResize = useCallback(() => {
        onSelectionMenuClicked(true);
        setHideResizeButtons(!hideResizeButtons);
    }, [hideResizeButtons, onSelectionMenuClicked]);

    return (
        <div hidden={!isImageEditing}>
            {/* dummy loader to extract image dimensions without 
                causing recursive loop */}
            <img
                hidden
                ref={imageRef}
                alt=""
                src={imageSrc}
                draggable={false}
                onLoad={onSizeChange}
            />
            <SelectMenu
                onCrop={onCrop}
                onCut={onCut}
                onCopy={onCopy}
                onResize={onResize}
                top={selectMenuTop}
                left={selectMenuLeft}
                hidden={!isSelectMenuVisible}
            />
            <img
                style={{
                    top: imageTop + 'px',
                    left: imageLeft + 'px',
                    width: width + 'px',
                    height: height + 'px',
                }}
                className={`${styles.image}`}
                draggable={false}
                src={imageSrc}
                alt=""
                ref={imageRefPlot}
            />
            <div
                style={{
                    top: imageTop + 'px',
                    left: imageLeft + 'px',
                    width: width + 'px',
                    height: height + 'px',
                }}
                draggable={false}
                className={`${styles.imageContainer}`}
                onMouseDown={onImageMouseDown}
                onMouseMove={onImageMouseMove}
                onMouseUp={onImageMouseUp}
                role="button"
                tabIndex={0}
            >
                <div
                    onMouseDown={onMouseDown}
                    onMouseMove={onResizeMouseMove}
                    onMouseUp={onResizeMouseUp}
                    className={`${styles.sizingButtons} ${styles.bottomRightButton}`}
                    draggable={false}
                    role="button"
                    tabIndex={0}
                    hidden={hideResizeButtons}
                    aria-label={'Bottom right resize button'}
                ></div>
                <div
                    onMouseDown={onMouseDown}
                    onMouseMove={onResizeMouseMove}
                    onMouseUp={onResizeMouseUp}
                    className={`${styles.sizingButtons} ${styles.topRightButton}`}
                    draggable={false}
                    role="button"
                    tabIndex={0}
                    hidden={hideResizeButtons}
                    aria-label={'Top right resize button'}
                ></div>
                <div
                    onMouseDown={onMouseDown}
                    onMouseMove={onResizeMouseMove}
                    onMouseUp={onResizeMouseUp}
                    className={`${styles.sizingButtons} ${styles.bottomLeftButton}`}
                    draggable={false}
                    role="button"
                    tabIndex={0}
                    hidden={hideResizeButtons}
                    aria-label={'Bottom left resize button'}
                ></div>
                <div
                    onMouseDown={onMouseDown}
                    onMouseMove={onResizeMouseMove}
                    onMouseUp={onResizeMouseUp}
                    className={`${styles.sizingButtons}`}
                    draggable={false}
                    role="button"
                    tabIndex={0}
                    hidden={hideResizeButtons}
                    aria-label={'Top left resize button'}
                ></div>
            </div>
        </div>
    );
};
