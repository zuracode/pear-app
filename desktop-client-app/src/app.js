import { html } from 'htm/react';
import { Form } from './components/form';
import { UserInfo } from './components/user-info';

const App = () => {
    return html`<div className="flex flex-col py-20 m-auto w-[60%]">
        <${Form} />
        <${UserInfo} />
    </div>`;
};

export default App;
