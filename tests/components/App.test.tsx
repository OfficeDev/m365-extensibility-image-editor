/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import App from '../../src/components/App';

test('App renders and initializes correctly', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'New file' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Save file' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Open file' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Line tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Rectangle tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Circle tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Arrow tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Brush tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Highlight tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Eraser tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Bucket tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Text tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Selection tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Zoom in tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Zoom out tool' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Undo' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Redo' })).toBeTruthy;
    expect(screen.getByRole('button', { name: 'Copy link' })).toBeTruthy;
});
