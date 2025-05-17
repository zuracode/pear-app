import { html } from 'htm/react';

import { cn } from '../lib/utils';
import { repoKey } from '../lib/repo-key';
import { useForm } from '../context/form';
import { useLocalStore } from '../context/local-store';
import { usePear } from '../context/pear';

import {
    PUT_USER_INFO_OPERATION_NAME,
    PUT_REPOS_OPERATION_NAME,
} from '../constants';

const selectOptions = [
    {
        value: PUT_USER_INFO_OPERATION_NAME,
        label: 'Get user info',
    },
    {
        value: PUT_REPOS_OPERATION_NAME,
        label: 'Get user repos',
    },
];

export const Form = () => {
    const {
        operationOption,
        setOperationOption,
        githubUser,
        setGithubUser,
        setCurrentUser,
        setNotFound,
        setSearching,
        setCurrentRepositories,
    } = useForm();
    const { getUser, addUser, getRepositories, addRepositories } =
        useLocalStore();
    const { coreInstance, beeInstance, rpcInstance } = usePear();

    const isSelectFilled = operationOption !== '';
    const isInputFilled = githubUser?.trim() !== '';
    const isButtonActive = isSelectFilled && isInputFilled;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSearching(true);
        setNotFound(false);
        setCurrentUser(null);
        setCurrentRepositories(null);

        if (operationOption === PUT_USER_INFO_OPERATION_NAME) {
            await handleGithubUser(githubUser);
            setSearching(false);

            return;
        }

        if (operationOption === PUT_REPOS_OPERATION_NAME) {
            await handleGithubUserRepos(githubUser);
            setSearching(false);

            return;
        }
    };

    const handleGithubUser = async (username) => {
        // get from local storage
        const githubUserFromLocalStore = getUser(username);
        console.log({ githubUserFromLocalStore });

        if (githubUserFromLocalStore) {
            setCurrentUser(githubUserFromLocalStore);

            return;
        }

        // get from bee local data
        const user = await beeInstance.current.get(username);
        console.log({ user });

        if (user?.value) {
            setCurrentUser(user.value);
            addUser(username, user.value);

            return;
        }

        // get from server
        const requestedData = await rpcInstance.current.request(
            'requested-data',
            Buffer.from(
                JSON.stringify({
                    operation: operationOption,
                    data: username,
                }),
                'utf-8'
            )
        );

        if (requestedData) {
            await coreInstance.current.update();

            const userStringToJson = Buffer.isBuffer(requestedData)
                ? JSON.parse(requestedData.toString('utf-8'))
                : null;

            console.log({ userStringToJson });

            if (!userStringToJson) {
                setNotFound(true);

                return;
            }

            setCurrentUser(userStringToJson);
            addUser(username, userStringToJson);

            return;
        }
    };

    const handleGithubUserRepos = async (username) => {
        const key = repoKey(username);

        // get from local storage
        const reposFromLocalStore = getRepositories(key);
        console.log({ reposFromLocalStore });

        if (reposFromLocalStore) {
            setCurrentRepositories(reposFromLocalStore);

            return;
        }

        // get from bee local data
        const repos = await beeInstance.current.get(key);

        console.log({ repos });

        if (repos?.value) {
            setCurrentRepositories(repos.value);
            addRepositories(key, repos.value);

            return;
        }

        // get from server
        const requestedData = await rpcInstance.current.request(
            'requested-data',
            Buffer.from(
                JSON.stringify({
                    operation: operationOption,
                    data: username,
                }),
                'utf-8'
            )
        );

        if (requestedData) {
            await coreInstance.current.update();

            const reposStringToJson = Buffer.isBuffer(requestedData)
                ? JSON.parse(requestedData.toString('utf-8'))
                : null;

            console.log({ reposStringToJson });

            if (!reposStringToJson) {
                setNotFound(true);

                return;
            }

            setCurrentRepositories(reposStringToJson);
            addRepositories(key, reposStringToJson);

            return;
        }
    };

    return html`
        <form onSubmit=${handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
                <label
                    htmlFor="select-option"
                    className="block text-sm font-medium cursor-pointer text-primary-foreground"
                >
                    Select an operation option
                </label>
                <select
                    id="select-option"
                    value=${operationOption}
                    onChange=${(e) => setOperationOption(e.target.value)}
                    className=${cn(
                        'w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-colors duration-200',
                        operationOption ? 'border-primary' : 'border-input'
                    )}
                >
                    <option value="" className="cursor-pointer">
                        Select an operation option...
                    </option>
                    ${selectOptions.map((option, index) => {
                        return html`<option
                            key="${index}"
                            value=${option.value}
                            className="cursor-pointer"
                        >
                            ${option.label}
                        </option>`;
                    })}
                </select>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="text-input"
                    className="block text-sm font-medium cursor-pointer text-primary-foreground"
                >
                    Enter GitHub username
                </label>
                <input
                    id="text-input"
                    type="text"
                    value=${githubUser}
                    onChange=${(e) => setGithubUser(e.target.value)}
                    disabled=${!isSelectFilled}
                    placeholder=${isSelectFilled
                        ? 'Type here...'
                        : 'Select an option first'}
                    className=${cn(
                        'w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-colors duration-200',
                        isInputFilled && isSelectFilled
                            ? 'border-primary'
                            : 'border-input'
                    )}
                />
            </div>

            <button
                type="submit"
                disabled=${!isButtonActive}
                className=${cn(
                    '!text-white w-full rounded-md px-4 py-2 text-sm font-medium text-primary-foreground transition-colors cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isButtonActive
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-primary'
                )}
            >
                Submit
            </button>
        </form>
    `;
};
