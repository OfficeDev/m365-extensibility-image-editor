// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useReducer } from 'react';

import styles from './App.module.scss';
import { BrushOptionPane } from './BrushOptionPane/BrushOptionPane';
import { Canvas } from './Canvas/Canvas';
import {
    CanvasContext,
    CanvasReducer,
    initialCanvasState,
} from './CanvasContext/CanvasContext';
import { CopyLinkDialog } from './CopyLinkDialog/CopyLinkDialog';
import {
    DialogsContext,
    DialogsReducer,
    initialDialogsState,
} from './DialogsContext/DialogsContext';
import { OpenDialog } from './OpenDialog/OpenDialog';
import { SaveDialog } from './SaveDialog/SaveDialog';
import { Toolbar } from './Toolbar/Toolbar';

// Main entrypoint to imageEditor view
// Initialize all app state/contexts here
export const App: React.FC = (): JSX.Element => {
    // States relating to imageEditor canvas functionality
    const [canvasState, canvasDispatch] = useReducer(
        CanvasReducer,
        initialCanvasState,
    );
    // States relating to dialog/menu visibilities
    const [dialogsState, dialogsDispatch] = useReducer(
        DialogsReducer,
        initialDialogsState,
    );

    // we want to dismiss all dialogs when user clicks onto the canvas
    const dismissMenus = useCallback(
        (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            dialogsDispatch({ type: 'dismissAll' });
        },
        [],
    );

    return (
        <DialogsContext.Provider
            value={{ state: dialogsState, dispatch: dialogsDispatch }}
        >
            <CanvasContext.Provider
                value={{ state: canvasState, dispatch: canvasDispatch }}
            >
                <div className={styles.app}>
                    <OpenDialog isVisible={dialogsState.isOpenDialogVisible} />
                    <SaveDialog isVisible={dialogsState.isSaveDialogVisible} />
                    <Toolbar />
                    <BrushOptionPane />
                    <CopyLinkDialog
                        isVisible={dialogsState.isCopyLinkDialogVisible}
                    />
                    <div
                        onMouseDown={dismissMenus}
                        role="button"
                        tabIndex={0}
                        aria-label="Canvas"
                    >
                        <Canvas />
                    </div>
                </div>
            </CanvasContext.Provider>
        </DialogsContext.Provider>
    );
};

export default App;
