/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useReducer } from 'react';

import {
    CanvasReducer,
    initialCanvasState,
    ToolType,
} from '../../src/components/CanvasContext/CanvasContext';

describe('Canvas Context', () => {
    it('Canvas reducer successfully sets states', () => {
        const { result } = renderHook(() =>
            useReducer(CanvasReducer, initialCanvasState),
        );
        const [state] = result.current;

        expect(state).toBeDefined();
        expect(state.brushColor.str).toBe('#000000');
        expect(state.fillColor.str).toBe('#000000');
        expect(state.shapeColor.str).toBe('#000000');
        expect(state.activeTool).toBe(ToolType.Brush);
        expect(state.brushSize).toBe(2);
        expect(state.eraserSize).toBe(20);
    });
});
