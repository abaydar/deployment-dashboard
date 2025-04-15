import AppsDashboard, { AppsProps } from "@/components/AppsDashboard/AppsDashboard";

export async function getServerSideProps() {
    try {
        const res = await fetch('http://localhost:3000/api/applications');
        const apps = await res.json();
        return { props: { apps }  }
    } catch (e) {
        console.error(e)

        return {
            props: {
                apps: [],
                error: 'Failed to fetch apps'
            }
        }
    }
}

export default function Apps({ apps }: AppsProps) {
    return (
        <AppsDashboard apps={apps}/>
    )
};