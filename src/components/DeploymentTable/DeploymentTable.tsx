import { Deployment } from "../Deployments"
import "./DeploymentTable.css"

interface DeploymentTableProps {
    deployments: Deployment[]
}

const DeploymentTable = ({ deployments }: DeploymentTableProps) => (
    <table className="deployment-table">
        <thead className="deployment-header">
            <tr>
                <th>App Name</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Time</th>
                <th>Triggered By</th>
            </tr>
        </thead>
        <tbody className="deployment-body">
            {deployments.map((deployment) => (
                <tr key={`${deployment.app}-${deployment.timestamp}`} className={`status-${deployment.status}`}>
                    <th scope="row">{deployment.app}</th>
                    <td>{deployment.env}</td>
                    <td>{deployment.status}</td>
                    <td>{deployment.timestamp}</td>
                    <td>{deployment.triggeredBy}</td>
                </tr>
            ))}
        </tbody>
    </table>    
);

export default DeploymentTable;