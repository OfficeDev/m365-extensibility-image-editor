// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IColor } from '@fluentui/react';

import { Coordinate } from './Canvas.types';

// Implemented using span fill algorithm
// Pseudocode documented here https://en.wikipedia.org/wiki/Flood_fill
// returns bounds of the change region of what was filled
export const floodFill = (
    mousePos: Coordinate,
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    fillColor: IColor,
): [number, number, number, number] => {
    const tempLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const startPixel = context.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    const spanStack: Coordinate[] = [];
    const changeRegion: [number, number, number, number] = [
        mousePos.x,
        mousePos.x,
        mousePos.y,
        mousePos.y,
    ];

    // skip filling if start pixel is same as fill color
    if (
        fillColor.r === startPixel[0] &&
        fillColor.g === startPixel[1] &&
        fillColor.b === startPixel[2] &&
        startPixel[3] === 255
    ) {
        return changeRegion;
    }

    const matchStartColor = (x: number, y: number): boolean => {
        const pixelPos = (y * canvasWidth + x) * 4;
        const r = tempLayer.data[pixelPos];
        const g = tempLayer.data[pixelPos + 1];
        const b = tempLayer.data[pixelPos + 2];
        const a = tempLayer.data[pixelPos + 3];
        return (
            r === startPixel[0] &&
            g === startPixel[1] &&
            b === startPixel[2] &&
            a === startPixel[3]
        );
    };

    const colorPixel = (x: number, y: number): void => {
        const pixelPos = (y * canvasWidth + x) * 4;
        tempLayer.data[pixelPos] = fillColor.r;
        tempLayer.data[pixelPos + 1] = fillColor.g;
        tempLayer.data[pixelPos + 2] = fillColor.b;
        tempLayer.data[pixelPos + 3] = 255;
    };

    spanStack.push(mousePos);

    const scan = (x1: number, x2: number, y: number) => {
        let added = false;
        for (let i = x1; i < x2; i++) {
            if (!matchStartColor(i, y)) {
                added = false;
            } else if (!added) {
                spanStack.push({ x: i, y: y });
                added = true;
            }
        }
    };

    while (spanStack.length > 0) {
        const coord = spanStack.pop();
        if (coord) {
            let xLeft = coord.x;
            let xRight = coord.x + 1;
            if (coord.y < changeRegion[2]) {
                changeRegion[2] = coord.y;
            } else if (coord.y > changeRegion[3]) {
                changeRegion[3] = coord.y;
            }
            while (matchStartColor(xLeft, coord.y) && xLeft >= 0) {
                colorPixel(xLeft, coord.y);
                xLeft--;
            }
            if (xLeft < changeRegion[0]) {
                changeRegion[0] = xLeft;
            }
            while (matchStartColor(xRight, coord.y) && xRight < canvasWidth) {
                colorPixel(xRight, coord.y);
                xRight++;
            }
            if (xRight > changeRegion[1]) {
                changeRegion[1] = xRight;
            }
            scan(xLeft, xRight - 1, coord.y - 1);
            scan(xLeft, xRight - 1, coord.y + 1);
        }
    }

    // draw on canvas once
    // drawing each line of color will cause performance issues
    context.putImageData(tempLayer, 0, 0);

    return changeRegion;
};

export const getMouseCoordinate = (
    event: React.MouseEvent<Element, MouseEvent>,
    boundings: DOMRect,
    zoomPercentage: number,
    scrollTop: number,
    scrollLeft: number,
): Coordinate => {
    let computedX = (event.clientX - boundings.left + scrollLeft) * 2;
    let computedY = (event.clientY - boundings.top + scrollTop) * 2;
    computedX = Math.round(computedX / (zoomPercentage / 100));
    computedY = Math.round(computedY / (zoomPercentage / 100));
    return {
        x: computedX,
        y: computedY,
    };
};

export const isResizingTextArea = (
    inputTextFieldDOM: HTMLTextAreaElement,
    previousTextAreaSize: { height: number; width: number },
): boolean => {
    return (
        previousTextAreaSize.height !== inputTextFieldDOM.offsetHeight ||
        previousTextAreaSize.width !== inputTextFieldDOM.offsetWidth
    );
};

export const getCoordinateForTextStartPosition = (
    event: React.MouseEvent<Element, MouseEvent>,
    boundings: DOMRect | undefined,
    zoomPercentage: number,
    scrollTop: number,
    scrollLeft: number,
    inputTextFieldDOM: HTMLTextAreaElement,
): Coordinate => {
    if (!boundings) {
        return { x: 0, y: 0 };
    }
    const centerX = inputTextFieldDOM.offsetWidth / 2;
    const centerY = inputTextFieldDOM.offsetHeight / 2;
    const computedX =
        (event.clientX - boundings.left - centerX + scrollLeft) /
        (zoomPercentage / 100);
    const computedY =
        (event.clientY - boundings.top - centerY + scrollTop) /
        (zoomPercentage / 100);
    return {
        x: computedX,
        y: computedY,
    };
};

export const getCoordinateForTextEndPosition = (
    event: React.MouseEvent<Element, MouseEvent>,
    boundings: DOMRect | undefined,
    fontSize: number,
    zoomPercentage: number,
    scrollTop: number,
    scrollLeft: number,
    inputTextFieldDOM: HTMLTextAreaElement,
): Coordinate => {
    if (!boundings) {
        return { x: 0, y: 0 };
    }
    const centerX = inputTextFieldDOM.offsetWidth / 2;
    const centerY = inputTextFieldDOM.offsetHeight / 2;
    return {
        x:
            ((event.clientX - boundings.left - centerX + scrollLeft) * 2) /
            (zoomPercentage / 100),
        y:
            ((event.clientY - boundings.top - centerY + scrollTop) * 2 +
                fontSize) /
            (zoomPercentage / 100),
    };
};

export const drawEllipse = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
): void => {
    const offsetConst = 0.5522848,
        ox = (w / 2) * offsetConst, // control point offset horizontal
        oy = (h / 2) * offsetConst, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle

    context.beginPath();
    context.moveTo(x, ym);
    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    context.stroke();
};

export const drawLine = (
    context: CanvasRenderingContext2D,
    startPos: Coordinate,
    endPos: Coordinate,
): void => {
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y);
    context.stroke();
};

export const drawRectangle = (
    context: CanvasRenderingContext2D,
    startPos: Coordinate,
    endPos: Coordinate,
): void => {
    context.beginPath();
    context.rect(
        startPos.x,
        startPos.y,
        endPos.x - startPos.x,
        endPos.y - startPos.y,
    );
    context.stroke();
};

// PI const
const PI = Math.PI;
// angle of left arrowhead
const degreesInRadians225 = (225 * PI) / 180;
// angle of right arrowhead
const degreesInRadians135 = (135 * PI) / 180;

export const drawArrow = (
    context: CanvasRenderingContext2D,
    startPos: Coordinate,
    endPos: Coordinate,
    size: number,
): void => {
    // draw line
    drawLine(context, startPos, endPos);

    // calculate angle of line
    const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);

    // calc arrowhead points
    const x1 = endPos.x + size * Math.cos(angle + degreesInRadians225);
    const y1 = endPos.y + size * Math.sin(angle + degreesInRadians225);
    const x2 = endPos.x + size * Math.cos(angle + degreesInRadians135);
    const y2 = endPos.y + size * Math.sin(angle + degreesInRadians135);

    // draw arrow head
    context.beginPath();
    context.moveTo(endPos.x, endPos.y);
    context.lineTo(x1, y1);
    context.stroke();
    context.moveTo(endPos.x, endPos.y);
    context.lineTo(x2, y2);
    context.stroke();
};
