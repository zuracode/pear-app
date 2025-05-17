import { html } from 'htm/react';

import { cn } from '../lib/utils';
import { useForm } from '../context/form';
import { useLocalStore } from '../context/local-store';
import { usePear } from '../context/pear';

const PUT_USER_INFO_OPERATION_NAME = 'user_info_request';
const PUT_REPOS_OPERATION_NAME = 'repos_request';

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
        setNotFoundUser,
        setSearching,
    } = useForm();

    const { getUser, addUser } = useLocalStore();
    const { coreInstance, beeInstance, rpcInstance } = usePear();

    const isSelectFilled = operationOption !== '';
    const isInputFilled = githubUser?.trim() !== '';
    const isButtonActive = isSelectFilled && isInputFilled;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (operationOption === PUT_USER_INFO_OPERATION_NAME) {
            handleGithubUser(githubUser);
            return;
        }

        if (operationOption === PUT_REPOS_OPERATION_NAME) {
            handleGithubUserRepos();
            return;
        }
    };

    const handleGithubUser = async (githubUser) => {
        setSearching(true);
        setCurrentUser(null);
        setNotFoundUser(false);

        // get from local storage
        const githubUserFromLocalStore = getUser(githubUser);

        if (githubUserFromLocalStore) {
            setCurrentUser(githubUserFromLocalStore);
            setSearching(false);

            return;
        }

        // get from bee local data
        const user = await beeInstance.current.get(githubUser);

        if (user?.value) {
            addUser(githubUser, user.value);
            setCurrentUser(user.value);
            setSearching(false);

            return;
        }

        // get from server
        const requestedData = await rpcInstance.current.request(
            'requested-data',
            Buffer.from(
                JSON.stringify({
                    operation: operationOption,
                    data: githubUser,
                }),
                'utf-8'
            )
        );

        if (requestedData) {
            await coreInstance.current.update();

            const userStringToJson = Buffer.isBuffer(requestedData)
                ? JSON.parse(requestedData.toString('utf-8'))
                : null;

            if (!userStringToJson) {
                setNotFoundUser(true);
                setSearching(false);

                return;
            }

            setCurrentUser(userStringToJson);
            setSearching(false);
            addUser(githubUser, userStringToJson);

            return;
        }
    };

    const handleGithubUserRepos = () => {};

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
