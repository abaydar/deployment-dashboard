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
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({
        app: [],
        env: [],
        status: [],
    });
    const [appliedFilters, setAppliedFilters] = useState<Filters>({
        app: [],
        env: [],
        status: [],
    });

    const buildFiltersUrl = (filters: Filters, query: string) => {
        const queryString = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, values]) => {
            values.forEach((value: string) => queryString.append(key, value));
        });

        if (searchQuery !== '') {
            queryString.append('searchQuery', query);
        };

        return queryString;
    }
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const hasFilters = Object.values(appliedFilters).some((arr) => arr.length > 0);
            const hasSearch = searchQuery !== '';
            let url = '/api/deployments'

            if (hasFilters || hasSearch) {
                url = `${url}?${(buildFiltersUrl(appliedFilters, searchQuery))}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            const data = await response.json();
            setDeployments(data);
        } catch (e) {
            console.error(e)
        }
      }

      fetchData();
    }, [appliedFilters, searchQuery]);

    const handleFilterClick = () => {
        if (!isFilterClicked) {
            setFilters(appliedFilters);
        }
        setIsFilterClicked(!isFilterClicked);
    }

    const handleFilterChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setAreFiltersApplied(true);
        setIsFilterClicked(false);
        setAppliedFilters(filters);
    }

    const handleRemoveFilter = (type: keyof Filters, value: string) => {
        const newValues = appliedFilters[type].filter(f => f !== value);
        const newAppliedFilters = {...appliedFilters, [type]: newValues}
        
        setAppliedFilters(newAppliedFilters);

        const isEmpty = Object.values(newAppliedFilters).every(arr => arr.length === 0);
        if (isEmpty) {
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
        setAreFiltersApplied(false);
        setIsFilterClicked(false);
        setFilters({app: [], env: [], status: []})
        setAppliedFilters({app: [], env: [], status: []});
    };

    const isChecked = (type: keyof Filters, value: string) => {
        return filters[type].includes(value);
    }

    const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

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
            {!isFilterClicked && appliedFilters && Object.entries(appliedFilters).map(([key, values]) => (
                <>
                    {values.length > 0 && values.map((value: string, idx: number) => (
                        <div key={`${value}-${idx}`}>
                            <div>{value}</div>
                            <button onClick={() => handleRemoveFilter(key as keyof Filters, value)}>x</button>
                        </div>
                    ))}
                </>
            
            ))}
            <label>Search by app: </label><input placeholder="Search..." onChange={handleSearchQuery}/>
            {areFiltersApplied && <button onClick={handleClearFilters}>Clear All Filters</button>}
            <DeploymentTable deployments={deployments} />
        </>
    )
}

export default Deployments;