import { useState, useEffect } from "react";
import DeploymentTable from "./DeploymentTable/DeploymentTable";
import { Filter } from "./Filter";

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
    const [areFiltersApplied, setAreFiltersApplied] = useState<boolean>(false);
    const [appNameCheckedOptions, setAppNameCheckedOptions] = useState<string[]>([]);
    const [envCheckedOptions, setEnvCheckedOptions] = useState<string[]>([]);
    const [statusCheckedOptions, setStatusCheckedOptions] = useState<string[]>([]);
    const [filtersApplied, setFiltersApplied] = useState<string[]>([]);

    const getDeployments = async () => {
      try {
        const response = await fetch('/api/deployments');
        const data = await response.json();
        setDeployments(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    const getFilteredDeployments = async (params: { app?: string[]; env?: string[]; status?: string[]}) => {
        const queryString = new URLSearchParams();
        console.log('params: ', params);
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
            checkedOptions = {...checkedOptions, app: appNameCheckedOptions};
        }
        if (envCheckedOptions.length > 0) {
            checkedOptions = {...checkedOptions, env: envCheckedOptions};
        }
        if (statusCheckedOptions.length > 0) {
            checkedOptions = {...checkedOptions, status: statusCheckedOptions};
        }
        getFilteredDeployments(checkedOptions);
        setAreFiltersApplied(true);
        setFiltersApplied([...appNameCheckedOptions, ...envCheckedOptions, ...statusCheckedOptions])
        setIsFilterClicked(false);
    }

    const handleRemoveFilter = (filter: string) => {
        const activeAppFilters = appNameCheckedOptions.filter(f => f !== filter);
        const activeEnvFilters = envCheckedOptions.filter(f => f !== filter);
        const activeStatusFilters = statusCheckedOptions.filter(f => f !== filter);
        setAppNameCheckedOptions(activeAppFilters);
        setEnvCheckedOptions(activeEnvFilters);
        setStatusCheckedOptions(activeStatusFilters);

        getFilteredDeployments({
            ...activeAppFilters && {app: activeAppFilters},
            ...activeEnvFilters && {env: activeEnvFilters},
            ...activeStatusFilters && {status: activeStatusFilters},
        })

        const updatedFilters = filtersApplied.filter(f => f !== filter);
        setFiltersApplied(updatedFilters);

        if (filtersApplied.length === 0) {
            setAreFiltersApplied(false);
        }
        
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

    const handleStatusCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleCheckboxValue(e.target.value, statusCheckedOptions, setStatusCheckedOptions)
    }

    const handleClearFilters = () => {
        getDeployments();
        setAppNameCheckedOptions([]);
        setEnvCheckedOptions([]);
        setStatusCheckedOptions([]);
        setAreFiltersApplied(false);
        setIsFilterClicked(false);
        setFiltersApplied([]);
    };

    const isChecked = (value: string) => {
        const filtersApplied = [...appNameCheckedOptions, ...envCheckedOptions, ...statusCheckedOptions];
        return filtersApplied.includes(value);
    }

    return (
        <>
            <button
                onClick={handleFilterClick}
            >
                Filter
            </button>
            {isFilterClicked && 
                <Filter
                    handleFilterChanges={handleFilterChanges}
                    isChecked={isChecked}
                    handleAppNameCheckboxChange={handleAppNameCheckboxChange}
                    handleEnvCheckboxChange={handleEnvCheckboxChange}
                    handleStatusCheckboxChange={handleStatusCheckboxChange}
                />
            }
            {filtersApplied && filtersApplied.map((filterApplied) => (
                <>
                    <div>{filterApplied}</div>
                    <button onClick={() => handleRemoveFilter(filterApplied)}>x</button>
                </>
            ))}
            {areFiltersApplied && <button onClick={handleClearFilters}>Clear All Filters</button>}
            <DeploymentTable deployments={deployments} />
        </>
    )
}

export default Deployments;