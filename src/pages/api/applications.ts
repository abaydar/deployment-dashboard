import type { NextApiRequest, NextApiResponse } from "next";
import { apps } from '../../mockData/apps';

type App = {
    name: string;
    team: string;
    environments: string[];
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<App[]>,
) {
    res.status(200).json(apps)
}