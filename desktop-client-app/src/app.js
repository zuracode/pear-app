/** @typedef {import('pear-interface')} */

import { html } from 'htm/react';
import { useContext } from 'react';
import { PearContext } from './context/pear.js';
import { LoadingSpinner } from './components/spinner.js';

const App = () => {
    const pearContext = useContext(PearContext);

    if (!pearContext?.mainPhaseLoaded) {
        return html`<div
            className="flex justify-center items-center min-screen-height w-full"
        >
            <${LoadingSpinner} size="lg" />
        </div>`;
    }

    return html`<div
        className="text-primary min-screen-height w-full flex items-center justify-center"
    >
        app
    </div>`;
};

export default App;
