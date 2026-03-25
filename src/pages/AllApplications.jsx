import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../service/ApplicationService';
import ApplicationListEntry from '../components/ApplicationListEntry';

export default function AllApplications(){

    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const apps = await applicationService.getAllApplications();
                setApplications(apps)
            } catch (e) {
                navigate("/" , {replace : true})
            }
        })();
    }, [navigate]);


    return (

        <div>
            <h1>Applications</h1>

            <div>
            {applications.length === 0 ? (
                <p>No applications found</p>
            ) : 
            (
                applications.map((app) => <ApplicationListEntry onClick={()=> navigate(`/applications/${app.applicationId}`)} application={app} />
            ))}
        </div>

        </div>
        

        

    )

}
