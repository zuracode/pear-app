/* eslint-disable no-unused-vars */

import { html } from 'htm/react';

import { usePear } from '../context/pear';
import { LoadingSpinner } from '../components/spinner';

export const InitializerWrapper = ({ children }) => {
    const { isInitializing, initializationPhase } = usePear();

    if (!isInitializing) {
        return html`<div
            className="flex flex-col justify-center items-center min-screen-height w-full"
        >
            <${LoadingSpinner} size="lg" />
            <p>${initializationPhase}</p>
        </div>`;
    }

    return children;
};
