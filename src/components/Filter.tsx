interface FilterProps {
    handleFilterChanges: (e: React.FormEvent<HTMLFormElement>) => void;
    isChecked: (value: string) => boolean;
    handleAppNameCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEnvCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Filter = ({ handleFilterChanges, isChecked, handleAppNameCheckboxChange, handleEnvCheckboxChange}: FilterProps) => {
    const appNames = ['Payments', 'Checkout', 'Users', 'Business'];
    const envs = ['production', 'qa', 'develop'];

    return (
        <form onSubmit={handleFilterChanges}>
            <fieldset>
                <legend>By App:</legend>
                    {appNames.map((appName) => (
                        <>
                            <label>
                                <input
                                    key={appName}
                                    type='checkbox'
                                    value={appName}
                                    checked={isChecked(appName)}
                                    onChange={handleAppNameCheckboxChange}
                                />
                                {appName}
                            </label>
                        </>
                    ))}
            </fieldset>
            <fieldset>
                <legend>By Env:</legend>
                    {envs.map((env) => (
                        <>
                            <label>
                                <input
                                    key={env}
                                    type='checkbox'
                                    value={env}
                                    checked={isChecked(env)}
                                    onChange={handleEnvCheckboxChange}
                                />
                                {env}
                            </label>
                        </>
                    ))}
            </fieldset>
            <button>Apply Changes</button>
        </form>
    )
}