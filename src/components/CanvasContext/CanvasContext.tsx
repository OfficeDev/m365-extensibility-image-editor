// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getColorFromString, IColor } from '@fluentui/react';
import { createContext } from 'react';

import { CanvasPalette } from '../../canvas-palette/canvas-palette';
import { CANVAS_RESOLUTION_FACTOR } from '../../constants/ImageEditorAppConstants';
import { ImageEditorHistory } from '../../imageEditor-history/get-imageEditor-history';
import { ImageEditorStorageManager } from '../../imageEditor-storage-manager/get-imageEditor-storage-manager';

export type CanvasContextType = {
    state: CanvasState;
    dispatch?: React.Dispatch<CanvasAction>;
};

export enum ToolType {
    Brush,
    Eraser,
    Fill,
    Text,
    ShapeLine,
    ShapeCircle,
    ShapeRectangle,
    ShapeArrow,
    Highlighter,
    Selection,
    ZoomIn,
    ZoomOut,
}

const DEFAULT_CANVAS_HEIGHT = 600;
const DEFAULT_CANVAS_WIDTH = 1000;

export const initialCanvasState: CanvasState = {
    brushSize: 2,
    highlighterSize: 20,
    shapeSize: 2,
    eraserSize: 20,
    brushColor: getColorFromString('#000000')!,
    fillColor: getColorFromString('#000000')!,
    shapeColor: getColorFromString('#000000')!,
    activeTool: ToolType.Brush,
    textSize: 44,
    textColor: getColorFromString('#000000')!,
    zoomPercentage: 100,
    canvasWidth: DEFAULT_CANVAS_WIDTH * CANVAS_RESOLUTION_FACTOR,
    canvasHeight: DEFAULT_CANVAS_HEIGHT * CANVAS_RESOLUTION_FACTOR,
};

/**
 * Context State that directly effects user interaction on the Canvas
 */
export const CanvasContext = createContext<CanvasContextType>({
    state: initialCanvasState,
});

export type CanvasState = {
    context?: CanvasRenderingContext2D | undefined;
    canvasRef?: HTMLCanvasElement | undefined | null;
    imageEditorHistory?: ImageEditorHistory | undefined | null;
    brushColor: IColor;
    fillColor: IColor;
    shapeColor: IColor;
    brushSize: number;
    highlighterSize: number;
    eraserSize: number;
    shapeSize: number;
    activeTool: ToolType;
    imageEditorStorageManager?: ImageEditorStorageManager;
    canvasPalette?: CanvasPalette;
    textSize: number;
    textColor: IColor;
    zoomPercentage: number;
    canvasWidth: number;
    canvasHeight: number;
};

export type CanvasAction =
    | { type: 'setContext'; value: CanvasRenderingContext2D | undefined }
    | { type: 'setCanvasRef'; value: HTMLCanvasElement | undefined | null }
    | {
          type: 'setImageEditorHistory';
          value: ImageEditorHistory | undefined | null;
      }
    | { type: 'setActiveTool'; value: ToolType }
    | { type: 'setBrushSize'; value: number }
    | { type: 'setHighlighterSize'; value: number }
    | { type: 'setEraserSize'; value: number }
    | { type: 'setShapeSize'; value: number }
    | { type: 'setColor'; activeTool: ToolType; value: IColor }
    | { type: 'setImageEditorStorageManager'; value: ImageEditorStorageManager }
    | { type: 'setCanvasPalette'; value: CanvasPalette }
    | { type: 'setTextSize'; value: number }
    | { type: 'setTextFont'; value: string }
    | { type: 'setZoomPercentage'; value: number }
    | { type: 'setCanvasWidth'; value: number }
    | { type: 'setCanvasHeight'; value: number }
    | { type: 'onNewCanvas' };

export const CanvasReducer = (
    state: CanvasState,
    action: CanvasAction,
): CanvasState => {
    const newState = { ...state };
    switch (action.type) {
        case 'setContext':
            newState.context = action.value;
            return newState;
        case 'setCanvasRef':
            newState.canvasRef = action.value;
            return newState;
        case 'setImageEditorHistory':
            newState.imageEditorHistory = action.value;
            return newState;
        case 'setActiveTool':
            newState.activeTool = action.value;
            return newState;
        case 'setBrushSize':
            newState.brushSize = action.value;
            return newState;
        case 'setHighlighterSize':
            newState.highlighterSize = action.value;
            return newState;
        case 'setShapeSize':
            newState.shapeSize = action.value;
            return newState;
        case 'setEraserSize':
            newState.eraserSize = action.value;
            return newState;
        case 'setColor':
            if (action.activeTool === ToolType.Brush) {
                newState.brushColor = action.value;
            } else if (action.activeTool === ToolType.Fill) {
                newState.fillColor = action.value;
            } else if (action.activeTool === ToolType.Text) {
                newState.textColor = action.value;
            } else if (
                action.activeTool === ToolType.ShapeCircle ||
                action.activeTool === ToolType.ShapeRectangle ||
                action.activeTool === ToolType.ShapeLine ||
                action.activeTool === ToolType.ShapeArrow
            ) {
                newState.shapeColor = action.value;
            }
            return newState;
        case 'setImageEditorStorageManager':
            newState.imageEditorStorageManager = action.value;
            return newState;
        case 'setTextSize':
            newState.textSize = action.value;
            return newState;
        case 'setCanvasPalette':
            newState.canvasPalette = action.value;
            return newState;
        case 'setZoomPercentage':
            newState.zoomPercentage = action.value;
            return newState;
        case 'setCanvasWidth':
            newState.canvasWidth = action.value;
            return newState;
        case 'setCanvasHeight':
            newState.canvasHeight = action.value;
            return newState;
        case 'onNewCanvas':
            newState.imageEditorStorageManager &&
                newState.imageEditorStorageManager.clearCurrentImageEditorItem();
            newState.canvasWidth =
                DEFAULT_CANVAS_WIDTH * CANVAS_RESOLUTION_FACTOR;
            newState.canvasHeight =
                DEFAULT_CANVAS_HEIGHT * CANVAS_RESOLUTION_FACTOR;
            return newState;
        default:
            throw new Error('Invalid action type.');
    }
};
