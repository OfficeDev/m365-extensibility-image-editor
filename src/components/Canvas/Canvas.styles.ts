// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

import brush from '../../assets/cursors/brush.png';
import bucket from '../../assets/cursors/bucket.png';
import zoomIn from '../../assets/cursors/zoomIn.png';
import zoomOut from '../../assets/cursors/zoomOut.png';
import { ToolType } from '../CanvasContext/CanvasContext';

export const getCanvasPointerClass = (activeTool: ToolType): string => {
    let cursorType = 'default';

    switch (activeTool) {
        case ToolType.Brush:
            cursorType = `url(${brush}) 15 15, default`;
            break;
        case ToolType.Eraser:
            cursorType = 'none';
            break;
        case ToolType.Fill:
            cursorType = `url(${bucket}) 0 15, default`;
            break;
        case ToolType.ZoomIn:
            cursorType = `url(${zoomIn}) 0 15, default`;
            break;
        case ToolType.ZoomOut:
            cursorType = `url(${zoomOut}) 0 15, default`;
            break;
        default:
            cursorType = 'default';
            break;
    }

    return mergeStyles({
        cursor: cursorType,
    });
};
