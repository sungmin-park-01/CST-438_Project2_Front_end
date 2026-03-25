

export default function ApplicationListEntry({application, onClick}){
    return (
        <div>
            <button onClick={onClick}>{application.jobTitle}</button>
        </div>
    )
}