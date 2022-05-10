// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    TextField,
} from '@fluentui/react';
import { FormEvent, useContext, useState } from 'react';

import { CanvasContext } from '../CanvasContext/CanvasContext';
import { DialogsContext } from '../DialogsContext/DialogsContext';

type Props = {
    isVisible: boolean;
};

export const SaveDialog: React.FC<Props> = ({ isVisible }): JSX.Element => {
    const [fileName, setFileName] = useState<string>();
    const dialogsContext = useContext(DialogsContext);
    const canvasContext = useContext(CanvasContext);

    const modalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
    };

    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: 'Save',
    };

    const onFileSaveClicked = () => {
        if (fileName) {
            if (
                canvasContext.state.imageEditorStorageManager &&
                canvasContext.state.canvasPalette &&
                canvasContext.state.imageEditorHistory
            ) {
                canvasContext.state.imageEditorStorageManager
                    .runSaveACopy(fileName, true)
                    .then(() => {
                        onDismiss();
                    });
            }
        }
    };

    const onFileNameChange = (
        _event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string | undefined,
    ) => {
        setFileName(newValue);
    };

    const onDismiss = () => {
        if (isVisible) {
            dialogsContext.dispatch &&
                dialogsContext.dispatch({ type: 'toggleSaveDialog' });
        }
    };

    return (
        // supress fluent type error for children
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog
            hidden={
                !isVisible || !canvasContext.state.imageEditorStorageManager
            }
            onDismiss={onDismiss}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <TextField
                label={'File name'}
                value={fileName}
                onChange={onFileNameChange}
            ></TextField>
            {
                // supress fluent type error for children
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <DialogFooter>
                    <PrimaryButton
                        onClick={onFileSaveClicked}
                        ariaLabel={'Save'}
                    >
                        Save
                    </PrimaryButton>
                    <DefaultButton
                        onClick={onDismiss}
                        text="Cancel"
                        ariaLabel={'Cancel'}
                    />
                </DialogFooter>
            }
        </Dialog>
    );
};
