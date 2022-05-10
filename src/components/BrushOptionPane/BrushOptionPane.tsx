import { getColorFromString, Stack, SwatchColorPicker } from '@fluentui/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { PaletteInformation } from '../../canvas-palette/canvas-palette';
import { CanvasContext, ToolType } from '../CanvasContext/CanvasContext';
import { DialogsContext } from '../DialogsContext/DialogsContext';
import styles from './BrushOptionPane.module.scss';
import { SizeSlider } from './SizeSlider';

// Component that allows control over color and size of various tools
export const BrushOptionPane: React.FC = (): JSX.Element => {
    const { state, dispatch } = useContext(CanvasContext);
    const dialogsContext = useContext(DialogsContext);
    const [_recentBrushSizes, setRecentBrushSizes] = useState<number[]>([]);
    const isSetRecentBrushSizeListener = useRef(false);

    const colorCells = [
        { id: '#000000', label: 'black', color: '#000000' },
        { id: '#ca5010', label: 'orange', color: '#ca5010' },
        { id: '#8cbd18', label: 'yellowGreen', color: '#8cbd18' },
        { id: '#0b6a0b', label: 'green', color: '#0b6a0b' },
        { id: '#038387', label: 'cyan', color: '#038387' },
        { id: '#004e8c', label: 'cyanBlue', color: '#004e8c' },
        { id: '#8764b8', label: 'blueMagenta', color: '#8764b8' },
        { id: '#881798', label: 'magenta', color: '#881798' },
        { id: '#ffffff', label: 'white', color: '#ffffff' },
        { id: '#7a7574', label: 'gray', color: '#7a7574' },
        { id: '#69797e', label: 'gray20', color: '#69797e' },
    ];

    let selectedId = '#000';
    if (state.activeTool === ToolType.Brush) {
        selectedId = state.brushColor.str;
    } else if (state.activeTool === ToolType.Fill) {
        selectedId = state.fillColor.str;
    } else if (state.activeTool === ToolType.Text) {
        selectedId = state.textColor.str;
    } else if (
        state.activeTool === ToolType.ShapeCircle ||
        state.activeTool === ToolType.ShapeLine ||
        state.activeTool === ToolType.ShapeRectangle ||
        state.activeTool === ToolType.ShapeArrow
    ) {
        selectedId = state.shapeColor.str;
    }

    const onColorChange = useCallback(
        (
            _event: React.FormEvent<HTMLElement>,
            _id: string | undefined,
            color: string | undefined,
        ) => {
            color &&
                dispatch &&
                dispatch({
                    type: 'setColor',
                    activeTool: state.activeTool,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    value: getColorFromString(color)!,
                });
        },
        [dispatch, state.activeTool],
    );

    const setBrushSize = useCallback(
        (value: number) => {
            dispatch && dispatch({ type: 'setBrushSize', value: value });
        },
        [dispatch],
    );

    const setEraserSize = useCallback(
        (value: number) => {
            dispatch && dispatch({ type: 'setEraserSize', value: value });
        },
        [dispatch],
    );

    const setTextSize = useCallback(
        (value: number) => {
            dispatch && dispatch({ type: 'setTextSize', value: value });
        },
        [dispatch],
    );

    const setShapeSize = useCallback(
        (value: number) => {
            dispatch && dispatch({ type: 'setShapeSize', value: value });
        },
        [dispatch],
    );

    const setHighlighterSize = useCallback(
        (value: number) => {
            dispatch && dispatch({ type: 'setHighlighterSize', value: value });
        },
        [dispatch],
    );

    useEffect(() => {
        if (!isSetRecentBrushSizeListener.current && state.canvasPalette) {
            state.canvasPalette.addPaletteChangeListener(
                (palette: PaletteInformation) => {
                    setRecentBrushSizes([...palette.recentBrushSizes]);
                },
            );
            isSetRecentBrushSizeListener.current = true;
        }
    }, [state.canvasPalette]);

    const isColorPickerVisible =
        dialogsContext.state.isBrushOptionPaneVisible ||
        dialogsContext.state.isShapeOptionPaneVisible ||
        dialogsContext.state.isBucketOptionPaneVisible ||
        dialogsContext.state.isTextOptionPaneVisible;

    const isDialogVisible =
        isColorPickerVisible || dialogsContext.state.isEraserOptionPaneVisible;

    return (
        <>
            {isDialogVisible && (
                <Stack className={styles.container}>
                    {isColorPickerVisible && (
                        <SwatchColorPicker
                            columnCount={6}
                            cellHeight={25}
                            cellWidth={25}
                            cellBorderWidth={1}
                            cellShape={'circle'}
                            colorCells={colorCells}
                            onChange={onColorChange}
                            selectedId={selectedId}
                        />
                    )}

                    {dialogsContext.state.isBrushOptionPaneVisible && (
                        <Stack
                            className={styles.brushLineContainer}
                            verticalAlign="center"
                            horizontalAlign="center"
                        >
                            <div
                                className={styles.brushLine}
                                style={{
                                    backgroundColor: `#${state.brushColor.hex}`,
                                    height: state.brushSize * 0.5,
                                }}
                            ></div>
                        </Stack>
                    )}

                    <SizeSlider
                        defaultValue={state.brushSize}
                        isVisible={
                            dialogsContext.state.isBrushOptionPaneVisible
                        }
                        updateContextSize={setBrushSize}
                    />

                    <SizeSlider
                        defaultValue={state.textSize}
                        isVisible={dialogsContext.state.isTextOptionPaneVisible}
                        updateContextSize={setTextSize}
                    />

                    <SizeSlider
                        defaultValue={state.eraserSize}
                        isVisible={
                            dialogsContext.state.isEraserOptionPaneVisible
                        }
                        updateContextSize={setEraserSize}
                    />

                    <SizeSlider
                        defaultValue={state.shapeSize}
                        isVisible={
                            dialogsContext.state.isShapeOptionPaneVisible
                        }
                        updateContextSize={setShapeSize}
                    />

                    <SizeSlider
                        defaultValue={state.highlighterSize}
                        isVisible={
                            dialogsContext.state.isHighlighterOptionPaneVisible
                        }
                        updateContextSize={setHighlighterSize}
                    />
                </Stack>
            )}
        </>
    );
};
