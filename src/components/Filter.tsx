import { Filters } from "./Deployments";

interface FilterProps {
    handleFilterChanges: (e: React.FormEvent<HTMLFormElement>) => void;
    isChecked: (type: keyof Filters, value: string) => boolean;
    toggleCheckbox: (type: keyof Filters, value: string) => void;
}

export const Filter = ({ handleFilterChanges, isChecked, toggleCheckbox }: FilterProps) => {
    const appNames = ['Payments', 'Checkout', 'Users', 'Business'];
    const envs = ['production', 'qa', 'develop'];
    const statuses = ['success', 'pending', 'failed'];

    return (
        <form onSubmit={handleFilterChanges}>
            <fieldset>
                <legend>By App:</legend>
                    {appNames.map((appName) => (    
                        <label>
                            <input
                                key={appName}
                                type='checkbox'
                                value={appName}
                                checked={isChecked("app", appName)}
                                onChange={() => toggleCheckbox("app", appName)}
                            />
                            {appName}
                        </label>
                    ))}
            </fieldset>
            <fieldset>
                <legend>By Env:</legend>
                    {envs.map((env) => (
                            <label>
                                <input
                                    key={env}
                                    type='checkbox'
                                    value={env}
                                    checked={isChecked("env", env)}
                                    onChange={() => toggleCheckbox("env", env)}
                                />
                                {env}
                            </label>
                    ))}
            </fieldset>
            <fieldset>
                <legend>By Status:</legend>
                    {statuses.map((status) => (
                        <label>
                            <input
                                key={status}
                                type='checkbox'
                                value={status}
                                checked={isChecked("status", status)}
                                onChange={() => toggleCheckbox("status", status)}
                            />
                            {status}
                        </label>
                    ))}
            </fieldset>
            <button>Apply Changes</button>
        </form>
    )
}