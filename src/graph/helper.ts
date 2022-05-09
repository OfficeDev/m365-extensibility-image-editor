// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const format = (originalStr: string, words: string[]) => {
    let a = originalStr;
    for (const k in words) {
        a = a.replace('{' + k + '}', words[k]);
    }
    return a;
};

export const dataURLtoFile = (
    dataurl: string,
    filename: string,
): File | undefined => {
    const arr = dataurl.split(',');
    if (arr.length > 1) {
        const bstr = atob(arr[1]);
        const mimeArray = arr[0].match(/:(.*?);/);
        if (mimeArray && mimeArray.length > 1) {
            const mime = mimeArray[1];
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n-- > 0) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {
                type: mime,
            });
        }
    }
};
