import { useState } from 'react';
import './AppsDashboard.css'

interface App {
    name: string;
    team: string;
    environments: string[];
}

export interface AppsProps {
    apps: App[]
}

const AppsDashboard = ({ apps }: AppsProps) => {
    const [formData, setFormData] = useState({
        name: '',
        team: '',
        environments: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, ...{[e.target.name]: [e.target.value]}})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/applications', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                })
            })
            if (res.ok) {
                console.log("App added successfully");
                setFormData({
                    name: '',
                    team: '',
                    environments: ''
                })
              } else {
                console.error("Error adding app");
              }
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                Add a New App: 
                <label>Name: </label><input name="name" value={formData.name} onChange={handleChange}/>
                <label>Team: </label><input name="team" value={formData.team} onChange={handleChange}/>
                <label>Environments: </label><input name="environments" value={formData.environments} onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>
            <table className="apps-table">
                <thead className="apps-header">
                    <tr>
                        <th>App Name</th>
                        <th>Team</th>
                        <th>Environments</th>
                    </tr>
                </thead>
                <tbody>
                    {apps.map((app, idx) => (
                        <tr key={`${app}-${idx}`}>
                            <td>{app.name}</td>
                            <td>{app.team}</td>
                            <td>{app.environments.map((env, idx) => (
                                <span key={`${env}-${idx}`}>
                                    {env}{idx < app.environments.length - 1 ? ', ' : ''}
                                </span>
                            ))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default AppsDashboard;