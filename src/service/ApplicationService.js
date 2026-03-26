import { apiFetch } from "../api";

export const applicationService = {
    async getAllApplications() {
        return apiFetch('/job-applications')
    },

    async getApplication(applicationId){
        return apiFetch(`/job-applications/${applicationId}`)
    },

    async createApplication(applicationData){
        return apiFetch('/job-applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    },

    async replaceApplication(applicationId, applicationData) {
        return apiFetch(`/job-applications/${applicationId}`, {
            method: 'PUT',
            body: JSON.stringify(applicationData)
        });
    },

    async updateApplication( applicationId, applicationData) {
        return apiFetch(`/job-applications/${applicationId}`, {
            method: 'PATCH',
            body: JSON.stringify(applicationData)
        });
    },

    async deleteApplication( applicationId){
        return apiFetch(`/job-applications/${applicationId}`, {
            method: 'DELETE'
        });
    }
};
