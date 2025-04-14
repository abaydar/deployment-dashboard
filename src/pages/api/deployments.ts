import type { NextApiRequest, NextApiResponse } from "next";
import { deployments } from '../../mockData/deployments'

type Deployment = {
  app: string;
  env: string;
  status: string;
  timestamp: string;
  triggeredBy: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Deployment[]>,
) {
  const { app, env, status, searchQuery } = req.query
  let updatedDeployments = deployments;

  if (app) {
    updatedDeployments = updatedDeployments.filter((deployment) => deployment.app === app);
  }
  if (env) {
    updatedDeployments = updatedDeployments.filter((deployment) => deployment.env === env);
  }
  if (status) {
    updatedDeployments = updatedDeployments.filter((deployment) => deployment.status === status);
  }
  if (searchQuery) {
    const search = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;
    console.log(search);
    updatedDeployments = updatedDeployments.filter((deployment) =>
      deployment.app.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.status(200).json(updatedDeployments);
}
