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

export interface Filters {
    app: string[];
    env: string[];
    status: string[];
}

  
const Deployments = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([])
    const [isFilterClicked, setIsFilterClicked] = useState<boolean>(false);
    const [areFiltersApplied, setAreFiltersApplied] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        app: [],
        env: [],
        status: [],
    });

    const getDeployments = async () => {
      try {
        const response = await fetch('/api/deployments');
        const data = await response.json();
        setDeployments(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    const getFilteredDeployments = async (filters: Filters) => {
        const queryString = new URLSearchParams();
        
        console.log(filters)
        Object.entries(filters).forEach(([key, value]) => {
            queryString.append(key, value)
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
        getFilteredDeployments(filters);
        setAreFiltersApplied(true);
        setIsFilterClicked(false);
    }

    const handleRemoveFilter = (type: keyof Filters, value: string) => {
        const newValues = filters[type].filter(f => f !== value);
        setFilters({...filters, [type]: newValues});

        getFilteredDeployments(filters)

        if (Object.keys(filters).length === 0) {
            setAreFiltersApplied(false);
        }
        
    }

    const toggleCheckbox = (type: keyof Filters, value: string) => {
        if (filters[type].includes(value)){
            const newValues = filters[type].filter(f => f !== value);
            setFilters({...filters, [type]: newValues});
        } else {
            setFilters({...filters, [type]: [...filters[type], value]});
        }
    };

    const handleClearFilters = () => {
        getDeployments();
        setAreFiltersApplied(false);
        setIsFilterClicked(false);
        setFilters({app: [], env: [], status: []});
    };

    const isChecked = (type: keyof Filters, value: string) => {
        return filters[type].includes(value);
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
                    toggleCheckbox={toggleCheckbox}
                />
            }
            {!isFilterClicked && filters && Object.entries(filters).map(([key, values]) => (
                <>
                    {values.length > 0 && values.map((value: string) => (
                        <>
                            <div>{value}</div>
                            <button onClick={() => handleRemoveFilter(key as keyof Filters, value)}>x</button>
                        </>
                    ))}
                </>
            
            ))}
            {areFiltersApplied && <button onClick={handleClearFilters}>Clear All Filters</button>}
            <DeploymentTable deployments={deployments} />
        </>
    )
}

export default Deployments;