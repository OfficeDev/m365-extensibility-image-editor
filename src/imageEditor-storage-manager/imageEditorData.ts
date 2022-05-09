// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Note to developers:
 *
 * This app was designed as a standalone app
 * without a service/database/blob storage in mind
 *
 * Currently we store everything as items in onedrive
 *
 * Expect slow load times when fetching large amount of onedrive
 * items.
 *
 */

import { Client } from '@microsoft/microsoft-graph-client';
import { DriveItem } from '@microsoft/microsoft-graph-types';
import { v4 as uuidv4 } from 'uuid';

import { PaletteInformation } from '../canvas-palette/canvas-palette';
import {
    createDriveItem,
    deleteItemByDriveItemId,
    getAllChildrenItemsByDriveItemId,
    getItemByDriveItemId,
    getRootFolderPath,
    onedriveSearch,
    querySearch,
} from '../graph/GraphServiceApi';
import { ImageEditorUndoInformation } from '../imageEditor-history/get-imageEditor-history';

export const IMAGE_EDITOR_NAMESPACE = 'imageEditor';
const ImageEditorFolderPath = '/Apps/imageEditor';

export const createImageEditorItem = async (
    graphClient: Client,
    dataUrl: string,
    thumbnailImg: string,
    pictureName: string,
    imageEditorUndoInformation: ImageEditorUndoInformation | null = null,
    canvasPaletteInformation: PaletteInformation | null = null,
): Promise<ImageEditorItem> => {
    const id = uuidv4();
    const storageData = {
        imageEditor: {
            id: id,
            dataUrl: dataUrl,
            name: pictureName,
            thumbnail: thumbnailImg,
            imageEditorUndoInformationJsonString: imageEditorUndoInformation
                ? JSON.stringify(imageEditorUndoInformation)
                : undefined,
            canvasPaletteInformation: JSON.stringify(canvasPaletteInformation),
        },
    };
    await createDriveItem(
        graphClient,
        ImageEditorFolderPath,
        id,
        JSON.stringify(storageData),
    );
    return storageData.imageEditor;
};

export const updateImageEditorItem = async (
    graphClient: Client,
    id: string,
    imageEditorItem: ImageEditorItem,
    thumbnailImg: string,
): Promise<ImageEditorItem> => {
    const storageData = {
        imageEditor: {
            id: id,
            dataUrl: imageEditorItem.dataUrl,
            name: imageEditorItem.name,
            thumbnail: thumbnailImg,
            imageEditorUndoInformationJsonString:
                imageEditorItem.imageEditorUndoInformationJsonString ??
                undefined,
            canvasPaletteInformationJsonString:
                imageEditorItem.canvasPaletteInformationJsonString ?? undefined,
        },
    };
    await createDriveItem(
        graphClient,
        ImageEditorFolderPath,
        id,
        JSON.stringify(storageData),
    );
    return storageData.imageEditor;
};

export const getAImageEditorItem = async (
    graphClient: Client,
    imageEditorItemId: string,
    callback: (item: ImageEditorItem) => void,
): Promise<ImageEditorItem | undefined> => {
    return await onedriveSearch(graphClient, imageEditorItemId).then(
        async (result) => {
            if (result && result.id) {
                await getItemByDriveItemId(graphClient, result.id).then(
                    (driveItem) => {
                        if (driveItem) {
                            const xhr = new XMLHttpRequest();
                            const url =
                                driveItem['@microsoft.graph.downloadUrl'];
                            xhr.open('GET', url);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4 && xhr.status == 200) {
                                    const dataItem: ImageEditorItem =
                                        JSON.parse(xhr.responseText)[
                                            'imageEditor'
                                        ];
                                    if (dataItem) {
                                        callback(dataItem);
                                        return dataItem;
                                    }
                                    return undefined;
                                }
                            };
                            xhr.send();
                        }
                    },
                );
                return undefined;
            }
        },
    );
};

export const getAllImageEditorItems = async (
    graphClient: Client,
): Promise<ImageEditorItem[]> => {
    const basePath = await getRootFolderPath(graphClient);
    const CompleteAppFolderPath = `${basePath}/Apps`;
    const imageEditorFolder: DriveItem | undefined = await querySearch(
        graphClient,
        IMAGE_EDITOR_NAMESPACE,
        CompleteAppFolderPath,
    );

    // users have not saved any files yet
    if (!imageEditorFolder || !imageEditorFolder.id) {
        return [];
    }

    const allImageEditorItems = await getAllChildrenItemsByDriveItemId(
        graphClient,
        imageEditorFolder.id,
    );

    if (!allImageEditorItems) {
        return [];
    }

    return new Promise<ImageEditorItem[]>((resolve, reject) => {
        const items: ImageEditorItem[] = [];
        for (let n = 0; n < allImageEditorItems.length; n++) {
            const xhr = new XMLHttpRequest();
            const url = allImageEditorItems[n]['@microsoft.graph.downloadUrl'];
            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    const dataItem: ImageEditorItem = JSON.parse(
                        xhr.responseText,
                    )['imageEditor'];
                    if (dataItem) {
                        items.push({
                            id: dataItem.id,
                            dataUrl: dataItem.dataUrl,
                            thumbnail: dataItem.thumbnail,
                            name: dataItem.name,
                            imageEditorUndoInformationJsonString:
                                dataItem.imageEditorUndoInformationJsonString,
                            canvasPaletteInformationJsonString:
                                dataItem.canvasPaletteInformationJsonString,
                        });
                    } else {
                        reject();
                    }
                    if (items.length === allImageEditorItems.length) {
                        resolve(items);
                    }
                } else if (xhr.readyState === 4 && xhr.status !== 200) {
                    reject(xhr.status);
                }
            };
            xhr.send();
        }
    });
};

export const deleteAImageEditorItem = async (
    graphClient: Client,
    imageEditorId: string,
): Promise<void> => {
    await onedriveSearch(graphClient, imageEditorId).then((result) => {
        if (result && result.id) {
            deleteItemByDriveItemId(graphClient, result.id);
        }
    });
};

export type ImageEditorItem = {
    id?: string;
    name?: string;
    dataUrl?: string;
    thumbnail?: string;
    imageEditorUndoInformationJsonString?: string;
    canvasPaletteInformationJsonString?: string;
};
