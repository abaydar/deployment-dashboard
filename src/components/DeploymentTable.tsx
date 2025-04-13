import { Deployment } from "./Deployments"

interface DeploymentTableProps {
    deployments: Deployment[]
}

const DeploymentTable = ({ deployments }: DeploymentTableProps) => (
    <table>
        <thead>
            <tr>
                <th>App Name</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Time</th>
                <th>Triggered By</th>
            </tr>
        </thead>
        <tbody>
            {deployments.map((deployment) => (
                <tr key={`${deployment.app}-${deployment.timestamp}`}>
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