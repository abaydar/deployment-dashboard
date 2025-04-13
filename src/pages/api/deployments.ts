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
  const { app, env } = req.query
  let updatedDeployments = deployments;

  if (app) {
    updatedDeployments = updatedDeployments.filter((deployment) => deployment.app === app)
  }
  if (env) {
    updatedDeployments = updatedDeployments.filter((deployment) => deployment.env === env)
  }

  res.status(200).json(updatedDeployments);
}
