import {useState, useEffect} from 'react';
import { useNavigate, useParams, useLocation} from 'react-router-dom';
import { applicationService } from '../service/ApplicationService';
import { jobEntryService } from '../service/JobEntryService';

const emptyApplication = {
    jobTitle: '',
    companyName: '',
    salaryText: '',
    postingURL: '',
    status: '',
    dateApplied: ''
}

export default function ApplicationEntry() {

    const {applicationId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isNew = location.pathname.endsWith('/new');
    const isEdit = location.pathname.endsWith('/edit');
    const isView = !!applicationId && !isEdit;

    const[application, setApplication] = useState(emptyApplication);
    const[originalApplication, setOriginalApplication] = useState(null);

    const[loading, setLoading] = useState(!isNew);

    const jobEntryFields = ['jobTitle', 'companyName', 'salaryText', 'postingURL'];
    const jobApplicationFields = ['status', 'dateApplied'];

    useEffect(() => {
        if(isNew) {
            setApplication(emptyApplication);
            setLoading(false);
            return;
        }

        (async () => {
            try{
                const app = await applicationService.getApplication(applicationId);
                const entry = await jobEntryService.getEntry(app.jobId);

                const applicationPayload = {
                    jobId: app.jobId,
                    jobTitle: entry.jobTitle,
                    companyName: entry.companyName,
                    salaryText: entry.salaryText,
                    postingURL: entry.postingURL,
                    status: app.status,
                    dateApplied: app.dateApplied
                }

                setApplication(applicationPayload);
                setOriginalApplication({...applicationPayload});
            } catch (e) {
                console.log(e)
                navigate("/", {replace: true});
            } finally {
                setLoading(false);
            }
        })();
    }, [applicationId, isNew, navigate]);

    function handleChange(e) {
        const { name, value} = e.target;
        setApplication( prev => ({
            ...prev,
            [name] : value
        }));
    }

    async function handleCreate(e) {
        e.preventDefault();

        try{

            const jobEntryPayload = {
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                salaryText: application.salaryText,
                postingURL: application.postingURL

            }

            console.log("Entry payload: ", jobEntryPayload);
            

            const createdEntry = await jobEntryService.createEntry(jobEntryPayload);

            console.log("Entry : ", createdEntry);

            const jobApplicationPayload ={
                jobId: createdEntry.jobId,
                status: application.status,
                dateApplied: application.dateApplied
            }

            console.log("App payload: ", jobApplicationPayload);

            const createdApplication = await applicationService.createApplication(jobApplicationPayload)

            console.log("App: ", createdApplication);

            navigate(`/applications/${createdApplication.applicationId}`);
        } catch(e) {
            console.error(e);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();

        try {
                const entryChanged = hasChanges(originalApplication, application, jobEntryFields);
                const appChanged = hasChanges(originalApplication, application, jobApplicationFields);

                if(entryChanged){
                    await jobEntryService.replaceEntry(application.jobId, {
                        companyName : application.companyName,
                        jobTitle: application.jobTitle,
                        salaryText: application.salaryText,
                        postingURL: application.postingURL
                    });
                }

                if(appChanged){
                    await applicationService.replaceApplication(applicationId, {
                        jobId: application.jobId,
                        status: application.status,
                        dateApplied: application.dateApplied
                    });
                }

            navigate(`/applications/${applicationId}`)

        } catch(e) {
            console.error(e);
        } 
    }

    if(loading){
        return <div> Loading application...</div>;
    }

    function hasChanges(original, current, keys){
        return keys.some(key => original[key] !== current[key]);

    }


    return(
        <div>
            {isNew && (
                <form onSubmit={handleCreate}>
                    <h1>Create application</h1>

                    <div>
                        <label> Job Title</label>
                        <input 
                        name="jobTitle" 
                        value={application.jobTitle} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Company</label>
                        <input 
                        name="companyName" 
                        value={application.companyName} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Salary</label>
                        <input 
                        name="salaryText" 
                        value={application.salaryText} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Applied from</label>
                        <input 
                        name="postingURL" 
                        value={application.postingURL} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Status</label>
                        <input 
                        name="status" 
                        value={application.status} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Date Applied</label>
                        <input 
                        type = "date"
                        name="dateApplied" 
                        value={application.dateApplied} 
                        onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Create application</button>

                </form>
            )}

            {isView && (
                <div>
                    <h1>Application details</h1>

                    <br /><br />

                    <div>
                        <p><strong>Job Title:</strong> {application.jobTitle} </p>
                        <p><strong>Company:</strong> {application.companyName} </p>
                        <p><strong>Salary:</strong> {application.salaryText} </p>
                        <p><strong>Posting:</strong> {application.postingURL} </p>
                        <p><strong>Status:</strong> {application.status} </p>
                        <p><strong>Date applied:</strong> {application.dateApplied} </p>


                        <button onClick={() => navigate(`/applications/${applicationId}/edit`)}>
                            Edit application
                        </button>

                    </div>



                    

                </div>
            )}

             {isEdit && (
                <form onSubmit={handleUpdate}>
                    <h1>Edit application</h1>

                    <div>
                        <label> Job Title</label>
                        <input 
                        name="jobTitle" 
                        value={application.jobTitle} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Company</label>
                        <input 
                        name="companyName" 
                        value={application.companyName} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Salary</label>
                        <input 
                        name="salaryTest" 
                        value={application.salaryText} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Applied from</label>
                        <input 
                        name="postingURL" 
                        value={application.postingURL} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Status</label>
                        <input 
                        name="status" 
                        value={application.status} 
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label> Job Title</label>
                        <input 
                        type = "date"
                        name="dateApplied" 
                        value={application.dateApplied} 
                        onChange={handleChange}
                        />
                    </div>

                    <button type="submit"> Update application</button>

                </form>
            )}




        </div>
    )
}