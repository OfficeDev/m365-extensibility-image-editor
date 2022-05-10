// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Client } from '@microsoft/microsoft-graph-client';

import { CanvasPalette } from '../canvas-palette/canvas-palette';
import { ImageEditorHistory } from '../imageEditor-history/get-imageEditor-history';
import {
    createImageEditorItem,
    deleteAImageEditorItem,
    getAImageEditorItem,
    getAllImageEditorItems,
    ImageEditorItem,
    updateImageEditorItem,
} from './imageEditorData';

export interface ImageEditorStorageManager {
    getAllItems: () => Promise<ImageEditorItem[]>;
    getAnItem: (
        itemId: string,
        callback: (item: ImageEditorItem) => void,
    ) => Promise<ImageEditorItem | undefined>;
    runAutoSave: () => Promise<ImageEditorItem>;
    runSaveACopy: (
        newFileName: string,
        replaceAutoSave?: boolean,
    ) => Promise<ImageEditorItem>;
    changeCurrentImageEditorItem: (imageEditorItem: ImageEditorItem) => void;
    runDeleteImageEditorItem: (imageEditorItem: ImageEditorItem) => void;
    clearCurrentImageEditorItem: () => void;
    addAutoSaveListener: (func: () => void) => void;
}

const AUTOSAVE_PREFIX = 'autosave';
const DEFAULT_THUMBNAIL_HEIGHT = 180;
const DEFAULT_THUMBNAIL_WIDTH = 300;

export const getImageEditorStorageManager = (
    graphClient: Client,
    canvasRef: HTMLCanvasElement,
    imageEditorHistory: ImageEditorHistory,
    canvasPalette: CanvasPalette,
): ImageEditorStorageManager => {
    let currentImageEditorItem: ImageEditorItem | null = null;
    const autoSaveListeners: Array<() => void> = [];

    const clearCurrentImageEditorItem = () => {
        currentImageEditorItem = null;
        imageEditorHistory.clearHistory();
    };

    const addAutoSaveListener = (func: () => void): void => {
        autoSaveListeners.push(func);
    };

    const invokeAutoSaveListeners = () => {
        autoSaveListeners.forEach((a) => {
            a();
        });
    };

    const getAllItems = (): Promise<ImageEditorItem[]> => {
        return getAllImageEditorItems(graphClient);
    };

    const getAnItem = (
        itemId: string,
        callback: (item: ImageEditorItem) => void,
    ): Promise<ImageEditorItem | undefined> => {
        return getAImageEditorItem(graphClient, itemId, callback);
    };

    const runAutoSave = (): Promise<ImageEditorItem> => {
        const save = canvasRef.toDataURL();
        const fileName = getAutoSaveName();
        invokeAutoSaveListeners();
        if (!currentImageEditorItem) {
            return resizeImage(save).then((thumbnailImg) => {
                return createImageEditorItem(
                    graphClient,
                    save,
                    thumbnailImg,
                    fileName,
                    imageEditorHistory.getHistory(),
                    canvasPalette.getPaletteInformation(),
                ).then((res) => {
                    currentImageEditorItem = res;
                    return res;
                });
            });
        } else {
            if (currentImageEditorItem) {
                currentImageEditorItem.dataUrl = save;
                currentImageEditorItem.canvasPaletteInformationJsonString =
                    JSON.stringify(canvasPalette.getPaletteInformation());
                return resizeImage(save).then((thumbnailImg) => {
                    if (currentImageEditorItem && currentImageEditorItem.id) {
                        return updateImageEditorItem(
                            graphClient,
                            currentImageEditorItem.id,
                            currentImageEditorItem,
                            thumbnailImg,
                        ).then((res) => {
                            return res;
                        });
                    } else {
                        throw 'Failed to patch imageEditor item on autosave due to null id.';
                    }
                });
            } else {
                throw 'Failed to patch imageEditor item on autosave due to null id.';
            }
        }
    };

    const runDeleteImageEditorItem = (imageEditorItem: ImageEditorItem) => {
        if (imageEditorItem.id) {
            deleteAImageEditorItem(graphClient, imageEditorItem.id);
            if (imageEditorItem.id === currentImageEditorItem?.id) {
                clearCurrentImageEditorItem();
            }
        }
    };

    const runSaveACopy = (
        newFileName: string,
        replaceAutoSave?: boolean,
    ): Promise<ImageEditorItem> => {
        if (currentImageEditorItem && currentImageEditorItem.dataUrl) {
            return resizeImage(currentImageEditorItem.dataUrl).then(
                (thumbnailImg) => {
                    if (
                        currentImageEditorItem &&
                        currentImageEditorItem.dataUrl
                    ) {
                        return createImageEditorItem(
                            graphClient,
                            currentImageEditorItem.dataUrl,
                            thumbnailImg,
                            newFileName,
                            currentImageEditorItem.imageEditorUndoInformationJsonString
                                ? JSON.parse(
                                      currentImageEditorItem.imageEditorUndoInformationJsonString,
                                  )
                                : undefined,
                            canvasPalette.getPaletteInformation()
                                ? canvasPalette.getPaletteInformation()
                                : undefined,
                        ).then((res) => {
                            const oldAutoSaveId = currentImageEditorItem?.id;
                            if (replaceAutoSave && oldAutoSaveId) {
                                deleteAImageEditorItem(
                                    graphClient,
                                    oldAutoSaveId,
                                );
                            }
                            currentImageEditorItem = res;
                            return res;
                        });
                    } else {
                        throw 'Cannot save a copy for null data url.';
                    }
                },
            );
        } else {
            throw 'Cannot save a copy for null data url.';
        }
    };

    const getAutoSaveName = (): string => {
        return `${AUTOSAVE_PREFIX}-${new Date().toTimeString()}`;
    };

    const changeCurrentImageEditorItem = (imageEditorItem: ImageEditorItem) => {
        currentImageEditorItem = imageEditorItem;
    };

    const resizeImage = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = DEFAULT_THUMBNAIL_WIDTH;
                canvas.height = DEFAULT_THUMBNAIL_HEIGHT;
                const ctx = canvas.getContext('2d');
                ctx &&
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        DEFAULT_THUMBNAIL_WIDTH,
                        DEFAULT_THUMBNAIL_HEIGHT,
                    );
                resolve(canvas.toDataURL('image/png', 1));
            };
        });
    };

    return {
        getAnItem,
        getAllItems,
        runAutoSave,
        runSaveACopy,
        changeCurrentImageEditorItem,
        runDeleteImageEditorItem,
        clearCurrentImageEditorItem,
        addAutoSaveListener,
    };
};
