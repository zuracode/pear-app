/** @typedef {import('pear-interface')} */

import { html } from 'htm/react';
import { createRoot } from 'react-dom/client';

import { PearProvider } from './src/context/pear';
import { FormProvider } from './src/context/form';
import { InitializerWrapper } from './src/components/initializer-wrapper';
import { LocalStoreProvider } from './src/context/local-store';

import App from './src/app';

const { updates, reload } = Pear;
updates(() => reload());

const root = createRoot(document.querySelector('#root'));
root.render(
    html`
        <${PearProvider}>
            <${FormProvider}>
                <${InitializerWrapper}>
                    <${LocalStoreProvider}>
                        <${App} />
                    </>
                </>
            </>
        </>
    `
);
