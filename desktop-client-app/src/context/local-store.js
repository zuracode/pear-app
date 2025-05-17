import { html } from 'htm/react';
import { createContext, useContext, useState } from 'react';

const LocalStoreContext = createContext();

export const LocalStoreProvider = ({ children }) => {
    const [users, setUsers] = useState(new Map());
    const [repositories, setRepositories] = useState(new Map());

    const addUser = (username, userInfo) => {
        setUsers(new Map(users.set(username, userInfo)));
    };

    const getUser = (username) => {
        return users.get(username);
    };

    const addRepositories = (username, reposList) => {
        const key = `${username}-repos`;
        const prevRepositories = getRepositories(username);

        if (prevRepositories) {
            const combinedRepos = [...prevRepositories, ...reposList];
            setRepositories(new Map(repositories.set(key, combinedRepos)));
        } else {
            setRepositories(new Map(repositories.set(key, reposList)));
        }
    };

    const getRepositories = (username) => {
        const key = `${username}-repos`;
        return repositories.get(key);
    };

    const value = {
        addUser,
        getUser,
        addRepositories,
        getRepositories,
    };

    return html`
        <${LocalStoreContext} value=${value}>
            ${children}
        </>`;
};

export function useLocalStore() {
    const context = useContext(LocalStoreContext);

    if (!context) {
        throw new Error(
            'useLocalStore must be used within a LocalStoreProvider'
        );
    }
    return context;
}
