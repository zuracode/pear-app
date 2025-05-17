import { html } from 'htm/react';
import { useState, createContext, useContext } from 'react';

const FormContext = createContext(undefined);

export const FormProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [notFoundUser, setNotFoundUser] = useState(false);

    const [operationOption, setOperationOption] = useState('');
    const [githubUser, setGithubUser] = useState('');

    const value = {
        operationOption,
        setOperationOption,
        githubUser,
        setGithubUser,
        currentUser,
        setCurrentUser,
        notFoundUser,
        setNotFoundUser,
    };

    return html`<${FormContext.Provider} value=${value}>${children}<//>`;
};

export const useForm = () => {
    const context = useContext(FormContext);

    if (context === undefined) {
        throw new Error('useForm must be used within a FormProvider');
    }

    return context;
};
