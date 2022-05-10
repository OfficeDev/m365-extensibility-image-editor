// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface PaletteInformation {
    recentColors: string[];
    recentBrushSizes: number[];
}

export interface CanvasPalette {
    recentColors: string[];
    recentBrushSizes: number[];
    getPaletteInformation: () => PaletteInformation;
    setPaletteInformation: (paletteInformation?: PaletteInformation) => void;
    addRecentColor: (color: string) => void;
    addRecentBrushSize: (size: number) => void;
    addPaletteChangeListener: (
        func: (paletteInformation: PaletteInformation) => void,
    ) => void;
}

const RECENT_COLOR_LIMIT = 5;
const RECENT_BRUSH_SIZE_LIMIT = 5;
export const getCanvasPalette = (): CanvasPalette => {
    let recentColors: string[] = [];
    let recentBrushSizes: number[] = [];
    const paletteChangeListeners: ((colors: PaletteInformation) => void)[] = [];
    const addRecentColor = (color: string) => {
        if (recentColors.includes(color)) {
            return;
        }
        if (recentColors.length > RECENT_COLOR_LIMIT) {
            recentColors.shift();
        }
        recentColors.push(color);
        invokePaletteChangeListener(getPaletteInformation());
    };

    const addRecentBrushSize = (size: number) => {
        if (recentBrushSizes.includes(size)) {
            return;
        }
        if (recentBrushSizes.length > RECENT_BRUSH_SIZE_LIMIT) {
            recentBrushSizes.shift();
        }
        recentBrushSizes.push(size);
        invokePaletteChangeListener(getPaletteInformation());
    };

    const addPaletteChangeListener = (
        func: (paletteInformation: PaletteInformation) => void,
    ) => {
        paletteChangeListeners.push(func);
    };
    const invokePaletteChangeListener = (
        paletteInformation: PaletteInformation,
    ) => {
        paletteChangeListeners.forEach((l) => {
            l(paletteInformation);
        });
    };
    const getPaletteInformation = (): PaletteInformation => {
        return {
            recentColors,
            recentBrushSizes,
        };
    };
    const setPaletteInformation = (
        paletteInformation?: PaletteInformation,
    ): void => {
        recentColors = paletteInformation?.recentColors
            ? paletteInformation?.recentColors
            : [];
        recentBrushSizes = paletteInformation?.recentBrushSizes
            ? paletteInformation?.recentBrushSizes
            : [];
        invokePaletteChangeListener(getPaletteInformation());
    };
    return {
        recentColors,
        recentBrushSizes,
        setPaletteInformation,
        getPaletteInformation,
        addRecentColor,
        addRecentBrushSize,
        addPaletteChangeListener,
    };
};
