import { useState, useEffect } from "react";
import DeploymentTable from "./DeploymentTable";

export interface Deployment {
    app: string;
    env: string;
    status: string;
    timestamp: string;
    triggeredBy: string;
}

  
const Deployments = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([])
    const [isFilterClicked, setIsFilterClicked] = useState<boolean>(false);
    const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
    const [appNameCheckedOptions, setAppNameCheckedOptions] = useState<string[]>([]);
    const [envCheckedOptions, setEnvCheckedOptions] = useState<string[]>([]);

    const getDeployments = async () => {
      try {
        const response = await fetch('/api/deployments');
        const data = await response.json();
        setDeployments(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    const getFilteredDeployments = async (params: { app?: string[]; env?: string[]; }) => {
        const queryString = new URLSearchParams();

        Object.entries(params).forEach(([key, values]) => {
          values.forEach((value) => queryString.append(key, value));
        });

        try {
            const response = await fetch(`/api/deployments?${queryString}`)
            const data = await response.json();
            setDeployments(data);
        } catch (e) {
            console.error;
        }
    };
  
    useEffect(() => {
      getDeployments();
    }, []);

    const handleFilterClick = () => setIsFilterClicked(!isFilterClicked);

    const handleFilterChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let checkedOptions = {}
        if (appNameCheckedOptions.length > 0) {
            checkedOptions = {...checkedOptions, app: appNameCheckedOptions}
        }
        if (envCheckedOptions.length > 0) {
            checkedOptions = {...checkedOptions, env: envCheckedOptions}
        }
        getFilteredDeployments(checkedOptions);
        setFiltersApplied(true);
    }

    const toggleCheckboxValue = (value: string, selected: string[], setSelected: Function) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((val) => val !== value))
        } else {
            setSelected([...selected, value])
        }
    };

    const handleAppNameCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleCheckboxValue(e.target.value, appNameCheckedOptions, setAppNameCheckedOptions);
    };

    const handleEnvCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleCheckboxValue(e.target.value, envCheckedOptions, setEnvCheckedOptions);
    };

    const handleClearFilters = () => {
        getDeployments();
        setAppNameCheckedOptions([]);
        setEnvCheckedOptions([]);
        setFiltersApplied(false);
        setIsFilterClicked(false);
    };

    const isChecked = (value: string) => {
        const filtersApplied = [...appNameCheckedOptions, ...envCheckedOptions];
        return filtersApplied.includes(value);
    }

    const appNames = ['Payments', 'Checkout', 'Users', 'Business'];
    const envs = ['production', 'qa', 'develop'];

    return (
        <>
            <button
                onClick={handleFilterClick}
            >
                Filter
            </button>
            {isFilterClicked && 
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
            }
            {filtersApplied && <button onClick={handleClearFilters}>Clear Filters</button>}
            <DeploymentTable deployments={deployments} />
        </>
    )
}

export default Deployments;