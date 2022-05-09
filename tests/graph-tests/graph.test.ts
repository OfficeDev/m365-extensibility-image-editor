import '@testing-library/jest-dom';

import { graphApiFormatStrings } from '../../src/graph/constants';
import { dataURLtoFile, format } from '../../src/graph/helper';

describe('Graph Tests', () => {
    it('Data url to file returns correct file', () => {
        const testDataUrl =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGKCAYAAADucZJuAADVGklEQVR42uy9e7Btd1Xv+R27d53ea3Xq1Kl0KhWP3FSMuTHmIhfD4+Ixa65DjCFCwCCCyKtAXgEEWiE3CKYpKqJyQTGiBkR5qryUt6DycM+5IlcCRERums6N6TTS6TSdSqVSqbV2pU6f0X+s+fjN3/w952OttfceI3Wy9lprrjk/c4z5GHP8xm8MYmYMJUS0xcyn9Vf9+z62EctgY1oFS5/733bdh5VFRERERERE5PDJVl9OhenzwtHQX23Lx6xb30axnP7qY+nTGQpl0Zfvc9s2/QmLiIiIiIiIyGGVbd0h0aOfquNgeq9H5kzfm9Znc2hVp9G37hinJoTF5CyZ+PpkiXHcXNu12URY6p+FLN';
        const file = dataURLtoFile(testDataUrl, 'testFile');

        expect(file).toBeDefined();
        if (file) {
            expect(file.type).toBe('image/png');
            expect(file.size).toBe(307);
        }
    });

    it('Data url missing mime type returns undefined', () => {
        const testDataUrl =
            'data:image/png,iVBORw0KGgoAAAANSUhEUgAAArwAAAGKCAYAAADucZJuAADVGklEQVR42uy9e7Btd1Xv+R27d53ea3Xq1Kl0KhWP3FSMuTHmIhfD4+Ixa65DjCFCwCCCyKtAXgEEWiE3CKYpKqJyQTGiBkR5qryUt6DycM+5IlcCRERums6N6TTS6TSdSqVSqbV2pU6f0X+s+fjN3/w952OttfceI3Wy9lprrjk/c4z5GHP8xm8MYmYMJUS0xcyn9Vf9+z62EctgY1oFS5/733bdh5VFRERERERE5PDJVl9OhenzwtHQX23Lx6xb30axnP7qY+nTGQpl0Zfvc9s2/QmLiIiIiIiIyGGVbd0h0aOfquNgeq9H5kzfm9Znc2hVp9G37hinJoTF5CyZ+PpkiXHcXNu12URY6p+FLN';
        const file = dataURLtoFile(testDataUrl, 'testFile');

        expect(file).toBeUndefined();
    });

    it('Data url missing url returns undefined', () => {
        const testDataUrl = 'data:image/png';
        const file = dataURLtoFile(testDataUrl, 'testFile');

        expect(file).toBeUndefined();
    });

    it('Format returns correct string', () => {
        const formattedString = format(graphApiFormatStrings.CreateImage, [
            'test.png',
        ]);

        expect(formattedString).toBe('/me/drive/root:/test.png:/content');
    });
});
