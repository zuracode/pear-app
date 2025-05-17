import { html } from 'htm/react';
import { useState, createContext, useContext } from 'react';

const FormContext = createContext(undefined);

export const FormProvider = ({ children }) => {
    const [searching, setSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [currentRepositories, setCurrentRepositories] = useState([]);

    const [operationOption, setOperationOption] = useState('');
    const [githubUser, setGithubUser] = useState('');

    const value = {
        operationOption,
        setOperationOption,
        githubUser,
        setGithubUser,
        currentUser,
        setCurrentUser,
        currentRepositories,
        setCurrentRepositories,
        notFound,
        setNotFound,
        searching,
        setSearching,
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
