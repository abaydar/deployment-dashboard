import type { NextApiRequest, NextApiResponse } from "next";
// import { apps } from '../../mockData/apps';

type App = {
    name: string;
    team: string;
    environments: string[];
}

let apps: App[] = [
    {
      name: "Payments",
      team: "Payments Team",
      environments: ["dev", "qa", "staging", "production"]
    },
    {
      name: "Checkout",
      team: "Checkout Squad",
      environments: ["qa", "staging", "production"]
    },
    {
      name: "User Management",
      team: "Identity & Access",
      environments: ["dev", "qa"]
    },
    {
      name: "Business Dashboard",
      team: "BizOps",
      environments: ["staging", "production"]
    }
  ];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<App[] | App | { error: string }>,
) {
    try {
        if (req.method === "GET") {
            return res.status(200).json(apps)
        }
    
        if (req.method === "POST") {
            const { name, team, environments } = req.body;
    
            const newApp = {
                name,
                team,
                environments
            }
    
            apps.push(newApp);
    
            return res.status(201).json(newApp)
        }
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}