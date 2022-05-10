/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useReducer } from 'react';

import {
    DialogsReducer,
    initialDialogsState,
} from '../../src/components/DialogsContext/DialogsContext';

describe('Canvas Context', () => {
    it('Canvas reducer successfully sets states', () => {
        const { result } = renderHook(() =>
            useReducer(DialogsReducer, initialDialogsState),
        );

        const [state] = result.current;

        expect(state).toBeDefined();
        expect(state.isBrushOptionPaneVisible).toBe(false);
        expect(state.isBucketOptionPaneVisible).toBe(false);
        expect(state.isHighlighterOptionPaneVisible).toBe(false);
        expect(state.isEraserOptionPaneVisible).toBe(false);
        expect(state.isShapeOptionPaneVisible).toBe(false);
        expect(state.isColorPickerCalloutVisible).toBe(false);
        expect(state.isSaveDialogVisible).toBe(false);
        expect(state.isOpenDialogVisible).toBe(false);
        expect(state.isTextOptionPaneVisible).toBe(false);
        expect(state.isCopyLinkDialogVisible).toBe(false);
    });
});
