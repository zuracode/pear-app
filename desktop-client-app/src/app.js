import { html } from 'htm/react';
import { Form } from './components/form';
import { useForm } from './context/form';
import { UserInfo } from './components/user-info';

const App = () => {
    const { currentUser, notFoundUser } = useForm();

    return html`<div className="flex flex-col py-20 m-auto w-[60%]">
        <${Form} />
        <${UserInfo} user=${currentUser} notFoundUser=${notFoundUser} />
    </div>`;
};

export default App;
