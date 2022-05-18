// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

import { AutoSaveLabel } from '../AutoSaveLabel/AutoSaveLabel';
import { CanvasContext, ToolType } from '../CanvasContext/CanvasContext';
import { DialogsContext } from '../DialogsContext/DialogsContext';
import { Toolbutton } from '../ToolButton/Toolbutton';
import { Toolgroup } from '../Toolgroup/Toolgroup';
import styles from './Toolbar.module.scss';

export const Toolbar: React.FC = (): JSX.Element => {
    const canvasContext = useContext(CanvasContext);
    const dialogsContext = useContext(DialogsContext);
    const [isShowAutoSaveLabel, setIsShowAutoSaveLabel] = useState(false);
    const [isAutoSaveLabelInitialized, setIsShowAutoSaveLabelInitialized] =
        useState(false);
    useEffect(() => {
        if (
            canvasContext &&
            canvasContext.state.imageEditorStorageManager &&
            !isAutoSaveLabelInitialized
        ) {
            canvasContext.state.imageEditorStorageManager.addAutoSaveListener(
                () => {
                    setIsShowAutoSaveLabel(true);
                    setTimeout(() => {
                        setIsShowAutoSaveLabel(false);
                    }, 2000);
                },
            );
            setIsShowAutoSaveLabelInitialized(true);
        }
    }, [canvasContext, isAutoSaveLabelInitialized]);

    const onCopyLink = useCallback(() => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleCopyLinkDialog' });
    }, []);

    const onOpenClicked = async () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleOpenDialog' });
    };

    const onEraseClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleEraserOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Eraser,
            });
    };

    const onImageEditorClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleBrushOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Brush,
            });
    };

    const onHighlighterClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleHighlighterOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Highlighter,
            });
    };

    const onBucketClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleBucketOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Fill,
            });
    };

    const onTextClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleTextOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Text,
            });
    };

    const onLineClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleShapeOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.ShapeLine,
            });
    };

    const onRectangleClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleShapeOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.ShapeRectangle,
            });
    };

    const onCircleClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleShapeOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.ShapeCircle,
            });
    };

    const onArrowClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleShapeOptionPane' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.ShapeArrow,
            });
    };

    const onSelectClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'dismissAll' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: ToolType.Selection,
            });
    };

    const onZoomClicked = (isZoomIn: boolean) => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'dismissAll' });
        canvasContext.dispatch &&
            canvasContext.dispatch({
                type: 'setActiveTool',
                value: isZoomIn ? ToolType.ZoomIn : ToolType.ZoomOut,
            });
    };

    const onUndo = () => {
        if (canvasContext.state.imageEditorHistory) {
            canvasContext.state.imageEditorHistory.popLastUndo();
        }
    };

    const onRedo = () => {
        if (canvasContext.state.imageEditorHistory) {
            canvasContext.state.imageEditorHistory.popLastRedo();
        }
    };

    const onNew = () => {
        if (canvasContext.state.context) {
            canvasContext.state.context.clearRect(0, 0, 2000, 1200);
        }
        if (canvasContext.state.imageEditorStorageManager) {
            canvasContext.state.imageEditorStorageManager.clearCurrentImageEditorItem();
        }
    };

    const onSaveClicked = () => {
        dialogsContext.dispatch &&
            dialogsContext.dispatch({ type: 'toggleSaveDialog' });
    };

    const isImageStorageManagerDisabled = Boolean(
        canvasContext.state.imageEditorStorageManager,
    );

    const disabledReason = 'Functionality disabled without sign in';

    return (
        <div className={styles.topBar}>
            <Stack horizontal className={styles.toolbarContainer}>
                <Toolgroup width={100}>
                    <Toolbutton
                        iconName={'Add'}
                        onClick={onNew}
                        ariaLabel={'New file'}
                        title={'New file'}
                    />
                    <Toolbutton
                        iconName={'Save'}
                        onClick={onSaveClicked}
                        ariaLabel={'Save file'}
                        isDisabled={isImageStorageManagerDisabled}
                        title={
                            isImageStorageManagerDisabled
                                ? disabledReason
                                : 'Save File'
                        }
                    />
                    <Toolbutton
                        iconName={'OpenFolderHorizontal'}
                        onClick={onOpenClicked}
                        ariaLabel={'Open file'}
                        isDisabled={isImageStorageManagerDisabled}
                        title={
                            isImageStorageManagerDisabled
                                ? disabledReason
                                : 'Open File'
                        }
                    />
                    <div className={styles.loadingIconContainer}>
                        {isShowAutoSaveLabel && <AutoSaveLabel />}
                    </div>
                </Toolgroup>
                <div className={styles.centerContainer}>
                    <Toolgroup width={100}>
                        <Toolbutton
                            iconName={'Line'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ShapeLine
                            }
                            onClick={onLineClicked}
                            ariaLabel={'Line tool'}
                            title={'Line tool'}
                        />
                        <Toolbutton
                            iconName={'RectangleShape'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ShapeRectangle
                            }
                            onClick={onRectangleClicked}
                            ariaLabel={'Rectangle tool'}
                            title={'Rectangle tool'}
                        />
                        <Toolbutton
                            iconName={'CircleRing'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ShapeCircle
                            }
                            onClick={onCircleClicked}
                            ariaLabel={'Circle tool'}
                            title={'Circle tool'}
                        />
                        <Toolbutton
                            iconName={'ArrowTallUpRight'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ShapeArrow
                            }
                            onClick={onArrowClicked}
                            ariaLabel={'Arrow tool'}
                            title={'Arrow tool'}
                        />
                    </Toolgroup>
                    <Toolgroup width={120}>
                        <Toolbutton
                            iconName={'Brush'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.Brush
                            }
                            onClick={onImageEditorClicked}
                            ariaLabel={'Brush tool'}
                            title={'Brush tool'}
                        />
                        <Toolbutton
                            iconName={'Highlight'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.Highlighter
                            }
                            onClick={onHighlighterClicked}
                            ariaLabel={'Highlight tool'}
                            title={'Highlight tool'}
                        />
                        <Toolbutton
                            iconName={'EraseTool'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.Eraser
                            }
                            onClick={onEraseClicked}
                            ariaLabel={'Eraser tool'}
                            title={'Eraser tool'}
                        />
                        <Toolbutton
                            iconName={'BucketColor'}
                            isActive={
                                canvasContext.state.activeTool === ToolType.Fill
                            }
                            onClick={onBucketClicked}
                            ariaLabel={'Bucket tool'}
                            title={'Bucket tool'}
                        />
                        <Toolbutton
                            iconName={'PlainText'}
                            isActive={
                                canvasContext.state.activeTool === ToolType.Text
                            }
                            onClick={onTextClicked}
                            ariaLabel={'Text tool'}
                            title={'Text tool'}
                        />
                        <Toolbutton
                            iconName={'BorderDash'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.Selection
                            }
                            onClick={onSelectClicked}
                            ariaLabel={'Selection tool'}
                            title={'Selection tool'}
                        />
                    </Toolgroup>
                    <Toolgroup width={100}>
                        <Toolbutton
                            iconName={'ZoomOut'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ZoomOut
                            }
                            onClick={() => {
                                onZoomClicked(false);
                            }}
                            ariaLabel={'Zoom out tool'}
                            title={'Zoom out tool'}
                        />
                        <Toolbutton
                            iconName={'ZoomIn'}
                            isActive={
                                canvasContext.state.activeTool ===
                                ToolType.ZoomIn
                            }
                            onClick={() => {
                                onZoomClicked(true);
                            }}
                            ariaLabel={'Zoom in tool'}
                            title={'Zoom in tool'}
                        />
                        <Toolbutton
                            iconName={'Undo'}
                            onClick={onUndo}
                            ariaLabel={'Undo'}
                            title={'Undo'}
                        />
                        <Toolbutton
                            iconName={'Redo'}
                            onClick={onRedo}
                            ariaLabel={'Redo'}
                            title={'Redo'}
                        />
                    </Toolgroup>
                </div>
                <Toolgroup width={50}>
                    <Toolbutton
                        iconName={'Link'}
                        onClick={onCopyLink}
                        ariaLabel={'Copy link'}
                        isDisabled={isImageStorageManagerDisabled}
                        title={
                            isImageStorageManagerDisabled
                                ? disabledReason
                                : 'Copy Link'
                        }
                    />
                </Toolgroup>
            </Stack>
        </div>
    );
};
