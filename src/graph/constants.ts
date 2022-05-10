// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const searchQueryFormatStrings = {
    Content: `{"requests": [{"entityTypes": ["driveItem"],"query": {"queryString": "{0} path:\\"{1}\\""} }]}`,
};

export const graphApiFormatStrings = {
    SearchAPISearchQuery: '/search/query',
    OneDriveSearch: "/me/drive/root/search(q='{0}')",
    Delete: '/me/drive/items/{0}', //0: item-id
    GetRoot: '/me/drive/root/',
    GetItem: '/me/drive/items/{0}', //0: item-id
    GetAllItems: '/me/drive/items/{0}/children', //0: item-id
    Create: '/me/drive/root:{0}/{1}:/content', //0: parent folder path, 1: file name  ex. aloha.txt
    CreateImage: '/me/drive/root:/{0}:/content', //0: file name
    CreateSharingLink: '/me/drive/items/{0}/createLink', //0: item-id
};
