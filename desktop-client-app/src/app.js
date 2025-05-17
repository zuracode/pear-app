import { html } from 'htm/react';

import { Form } from './components/form';
import { UserInfo } from './components/user-info';
import { Repositories } from './components/repositories';
import { useForm } from './context/form';

import {
    PUT_USER_INFO_OPERATION_NAME,
    PUT_REPOS_OPERATION_NAME,
} from './constants';
import { LoadingSpinner } from './components/spinner';

const App = () => {
    const { operationOption, searching, notFound } = useForm();

    return html`<div className="flex flex-col py-20 m-auto w-[60%]">
        <${Form} />
        ${(() => {
            if (searching) {
                return html`<div className="flex w-full justify-center mt-8">
                    <${LoadingSpinner} size="lg" />
                </div>`;
            }

            if (notFound) {
                return html`<p
                    className="text-center mt-8 text-red-600 font-medium"
                >
                    ${operationOption === PUT_USER_INFO_OPERATION_NAME
                        ? 'User not found'
                        : operationOption === PUT_REPOS_OPERATION_NAME
                          ? 'Repositories do not exist on user'
                          : ''}
                </p>`;
            }

            if (operationOption === PUT_USER_INFO_OPERATION_NAME) {
                return html`<${UserInfo} />`;
            }

            if (operationOption === PUT_REPOS_OPERATION_NAME) {
                return html`<${Repositories} />`;
            }
        })()}
    </div>`;
};

export default App;
