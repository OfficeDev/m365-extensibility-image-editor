// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Typescript module declarations
declare module '*.module.scss' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module '*.module.css' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}
