import { useLocation } from 'react-router-dom';

const Dashboard = () => {

    const location = useLocation();
    const data: any = location.state;

    return (
        <div>
            Dashboard
            {data?.from}
        </div>
    )
}

export default Dashboard;