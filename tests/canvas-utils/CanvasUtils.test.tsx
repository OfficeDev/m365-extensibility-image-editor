/**
 * @jest-environment jsdom
 */

import { getColorFromString } from '@fluentui/react';

import { Coordinate } from '../../src/components/Canvas/Canvas.types';
import {
    drawArrow,
    drawEllipse,
    drawLine,
    drawRectangle,
    floodFill,
    getCoordinateForTextEndPosition,
    getCoordinateForTextStartPosition,
    getMouseCoordinate,
    isResizingTextArea,
} from '../../src/components/Canvas/CanvasUtils';

describe('CanvasUtils', () => {
    it('Should flood fill without errors', async () => {
        const callback = jest.fn();

        const canvasContext: Partial<CanvasRenderingContext2D> = {
            getImageData: () => {
                return {
                    data: new Uint8ClampedArray(400),
                    width: 10,
                    height: 10,
                };
            },
            putImageData: () => {
                callback();
            },
        };
        const mosPos: Coordinate = { x: 0, y: 0 };

        floodFill(
            mosPos,
            canvasContext as CanvasRenderingContext2D,
            10,
            10,
            getColorFromString('#000000')!,
        );

        expect(callback.mock.calls.length).toBe(1);
    });

    it('Should get correct mouse coordinates', async () => {
        const boundings: DOMRect = {
            height: 100,
            width: 100,
            x: 0,
            y: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            toJSON: function () {
                throw new Error('Function not implemented.');
            },
        };

        const coordinate = getMouseCoordinate(
            { clientX: 5, clientY: 0 } as React.MouseEvent<Element, MouseEvent>,
            boundings,
            100,
            0,
            0,
        );

        expect(coordinate.x).toBe(10);
        expect(coordinate.y).toBe(0);
    });

    it('Is not resizing text area', async () => {
        const isResizing = isResizingTextArea(
            {
                offsetHeight: 5,
                offsetWidth: 10,
            } as unknown as HTMLTextAreaElement,
            { height: 5, width: 10 },
        );

        expect(isResizing).toBeFalsy();
    });

    it('Is resizing text area', async () => {
        const isResizing = isResizingTextArea(
            {
                offsetHeight: 5,
                offsetWidth: 10,
            } as unknown as HTMLTextAreaElement,
            { height: 2, width: 2 },
        );

        expect(isResizing).toBeTruthy();
    });

    it('getCoordinateForTextStartPosition returns correct coordinates', async () => {
        const boundings: DOMRect = {
            height: 100,
            width: 100,
            x: 0,
            y: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            toJSON: function () {
                throw new Error('Function not implemented.');
            },
        };
        const coordinate = getCoordinateForTextStartPosition(
            {
                clientX: 5,
                clientY: 5,
            } as React.MouseEvent<Element, MouseEvent>,
            boundings,
            100,
            0,
            0,
            {
                offsetHeight: 5,
                offsetWidth: 10,
            } as unknown as HTMLTextAreaElement,
        );

        expect(coordinate.x).toBe(0);
        expect(coordinate.y).toBe(2.5);
    });

    it('getCoordinateForTextEndPosition returns correct coordinates', async () => {
        const boundings: DOMRect = {
            height: 100,
            width: 100,
            x: 0,
            y: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            toJSON: function () {
                throw new Error('Function not implemented.');
            },
        };
        const coordinate = getCoordinateForTextEndPosition(
            {
                clientX: 5,
                clientY: 5,
            } as React.MouseEvent<Element, MouseEvent>,
            boundings,
            14,
            100,
            0,
            0,
            {
                offsetHeight: 5,
                offsetWidth: 10,
            } as unknown as HTMLTextAreaElement,
        );

        expect(coordinate.x).toBe(0);
        expect(coordinate.y).toBe(19);
    });

    it('Should draw ellipse without errors', async () => {
        const beginPath = jest.fn();
        const moveTo = jest.fn();
        const bezierCurveTo = jest.fn();
        const stroke = jest.fn();

        const canvasContext: Partial<CanvasRenderingContext2D> = {
            beginPath: beginPath,
            moveTo: moveTo,
            bezierCurveTo: bezierCurveTo,
            stroke: stroke,
        };

        drawEllipse(
            canvasContext as CanvasRenderingContext2D,
            5,
            10,
            1000,
            100,
        );

        expect(beginPath.mock.calls.length).toBe(1);
        expect(moveTo.mock.calls.length).toBe(1);
        expect(bezierCurveTo.mock.calls.length).toBe(4);
        expect(stroke.mock.calls.length).toBe(1);
    });

    it('Should draw line without errors', async () => {
        const beginPath = jest.fn();
        const moveTo = jest.fn();
        const stroke = jest.fn();
        const lineTo = jest.fn();

        const canvasContext: Partial<CanvasRenderingContext2D> = {
            beginPath: beginPath,
            moveTo: moveTo,
            lineTo: lineTo,
            stroke: stroke,
        };

        drawLine(
            canvasContext as CanvasRenderingContext2D,
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        );

        expect(beginPath.mock.calls.length).toBe(1);
        expect(moveTo.mock.calls.length).toBe(1);
        expect(lineTo.mock.calls.length).toBe(1);
        expect(stroke.mock.calls.length).toBe(1);
    });

    it('Should draw rect without errors', async () => {
        const beginPath = jest.fn();
        const stroke = jest.fn();
        const rect = jest.fn();

        const canvasContext: Partial<CanvasRenderingContext2D> = {
            beginPath: beginPath,
            stroke: stroke,
            rect: rect,
        };

        drawRectangle(
            canvasContext as CanvasRenderingContext2D,
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        );

        expect(beginPath.mock.calls.length).toBe(1);
        expect(stroke.mock.calls.length).toBe(1);
        expect(rect.mock.calls.length).toBe(1);
    });

    it('Should draw arrow without errors', async () => {
        const beginPath = jest.fn();
        const moveTo = jest.fn();
        const stroke = jest.fn();
        const lineTo = jest.fn();

        const canvasContext: Partial<CanvasRenderingContext2D> = {
            beginPath: beginPath,
            moveTo: moveTo,
            lineTo: lineTo,
            stroke: stroke,
        };

        drawArrow(
            canvasContext as CanvasRenderingContext2D,
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            10,
        );

        expect(beginPath.mock.calls.length).toBe(2);
        expect(stroke.mock.calls.length).toBe(3);
        expect(lineTo.mock.calls.length).toBe(3);
        expect(stroke.mock.calls.length).toBe(3);
    });
});
