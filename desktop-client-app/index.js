/** @typedef {import('pear-interface')} */

import { html } from 'htm/react';
import { createRoot } from 'react-dom/client';

import { PearProvider } from './src/context/pear.js';
import App from './src/app';

const { updates, reload } = Pear;
updates(() => reload());

const root = createRoot(document.querySelector('#root'));
root.render(
    html`<${PearProvider} key="root-provider">
            <${App} />
        </>
    `
);
