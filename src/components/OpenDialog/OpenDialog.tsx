// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
    IconButton,
    Image as FluentImage,
    ImageFit,
    List,
    Modal,
    Stack,
    Text,
} from '@fluentui/react';
import { useContext, useEffect, useState } from 'react';

import { ImageEditorUndoInformation } from '../../imageEditor-history/get-imageEditor-history';
import { ImageEditorItem } from '../../imageEditor-storage-manager/imageEditorData';
import { CanvasContext } from '../CanvasContext/CanvasContext';
import { DialogsContext } from '../DialogsContext/DialogsContext';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import styles from './OpenDialog.module.scss';

type Props = {
    isVisible: boolean;
};

/**
 * Open dialog component
 */
export const OpenDialog: React.FC<Props> = ({ isVisible }): JSX.Element => {
    const { state } = useContext(CanvasContext);
    const dialogsContext = useContext(DialogsContext);
    const canvasContext = useContext(CanvasContext);
    const [displayedImageEditorItems, setDisplayedImageEditorItems] =
        useState<ImageEditorItem[]>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

    // useEffect hook to fetch new items
    useEffect(() => {
        if (isVisible) {
            if (
                canvasContext.state.imageEditorStorageManager &&
                canvasContext.state.canvasPalette &&
                canvasContext.state.imageEditorHistory
            ) {
                canvasContext.state.imageEditorStorageManager
                    .getAllItems()
                    .then((items) => {
                        setIsLoaded(true);
                        setDisplayedImageEditorItems(items);
                    });
            }
        }
    }, [isVisible]);

    useEffect(() => {
        if (selectedImageIndex >= 0 && displayedImageEditorItems) {
            onLoadImage(displayedImageEditorItems[selectedImageIndex]);
        }
    }, [selectedImageIndex]);

    const onDeleteImage = (item: ImageEditorItem) => {
        if (
            state.imageEditorStorageManager &&
            item.id &&
            displayedImageEditorItems
        ) {
            state.imageEditorStorageManager.runDeleteImageEditorItem(item);
            setDisplayedImageEditorItems(
                displayedImageEditorItems.filter((value) => {
                    return value.id !== item.id;
                }),
            );
        }
    };

    const onLoadImageCallback = (item: ImageEditorItem) => {
        if (item.dataUrl) {
            const img = new Image();
            img.onload = function () {
                if (state.context) {
                    const previousGlobalCompositionOperation =
                        state.context.globalCompositeOperation;
                    state.context.globalCompositeOperation = 'source-over';
                    //draw background image
                    state.context.clearRect(
                        0,
                        0,
                        state.canvasWidth,
                        state.canvasHeight,
                    );
                    state.context.drawImage(img, 0, 0);
                    state.context.globalCompositeOperation =
                        previousGlobalCompositionOperation;
                    if (state.imageEditorHistory) {
                        if (item.imageEditorUndoInformationJsonString) {
                            const imageEditorInfo: ImageEditorUndoInformation =
                                JSON.parse(
                                    item.imageEditorUndoInformationJsonString,
                                );
                            state.imageEditorHistory.setHistory(
                                imageEditorInfo,
                            );
                        }
                    }
                    if (state.canvasPalette) {
                        if (item.canvasPaletteInformationJsonString) {
                            const json = JSON.parse(
                                item.canvasPaletteInformationJsonString,
                            );
                            state.canvasPalette.setPaletteInformation(json);
                        } else {
                            state.canvasPalette.setPaletteInformation();
                        }
                    }
                }
            };
            img.src = item.dataUrl;
        }
        if (isVisible) {
            dialogsContext.dispatch &&
                dialogsContext.dispatch({ type: 'toggleOpenDialog' });
            setIsLoaded(true);
        }
        if (state.imageEditorStorageManager) {
            state.imageEditorStorageManager.changeCurrentImageEditorItem(item);
        }
    };

    const onLoadImage = async (item: ImageEditorItem) => {
        if (item.id && canvasContext.state.imageEditorStorageManager) {
            canvasContext.state.imageEditorStorageManager.getAnItem(
                item.id,
                onLoadImageCallback,
            );
        }
    };

    const onDismiss = () => {
        if (isVisible) {
            dialogsContext.dispatch &&
                dialogsContext.dispatch({ type: 'toggleOpenDialog' });
        }
    };

    const onRenderCell = (
        item: ImageEditorItem | undefined,
        index: number | undefined,
        isScrolling: boolean | undefined,
    ): JSX.Element => {
        if (!index) {
            return <></>;
        }
        return (
            <Stack
                className={styles.itemCell}
                data-is-focusable={true}
                onClick={() => {
                    setIsLoaded(false);
                    setSelectedImageIndex(index);
                }}
                role="button"
                horizontal
            >
                <FluentImage
                    className={styles.itemImage}
                    src={isScrolling ? undefined : item?.thumbnail}
                    width={50}
                    height={50}
                    imageFit={ImageFit.cover}
                />
                <div className={styles.itemContent}>
                    <Text className={styles.itemName}>{item?.name}</Text>
                </div>
                <Stack className={styles.deleteButton}>
                    <IconButton
                        iconProps={{ iconName: 'Delete' }}
                        onClick={(event) => {
                            displayedImageEditorItems &&
                                onDeleteImage(displayedImageEditorItems[index]);
                            event.stopPropagation();
                        }}
                    />
                </Stack>
            </Stack>
        );
    };

    return (
        <Modal
            isOpen={isVisible && state.imageEditorStorageManager !== undefined}
            onDismiss={onDismiss}
            isBlocking={false}
            className={styles.modalStyles}
            containerClassName={styles.modalContainer}
            scrollableContentClassName={styles.scrollableContentClassName}
        >
            {isLoaded ? (
                <>
                    <Stack
                        horizontalAlign={'center'}
                        className={styles.listContainer}
                    >
                        {displayedImageEditorItems ? (
                            <>
                                <List
                                    items={displayedImageEditorItems}
                                    onRenderCell={onRenderCell}
                                />
                            </>
                        ) : (
                            <Stack
                                horizontalAlign="center"
                                verticalAlign="center"
                            >
                                <Stack.Item>
                                    <Text>Error loading items</Text>
                                </Stack.Item>
                            </Stack>
                        )}
                    </Stack>
                </>
            ) : (
                <LoadingPage height={'80vh'} />
            )}
        </Modal>
    );
};
