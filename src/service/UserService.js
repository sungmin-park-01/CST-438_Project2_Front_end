import { apiFetch } from "../api";

export const UserService = {
    async getAllUsers() {
        return apiFetch('/admin')
    },

    async getUser(UserId){
        return apiFetch(`/admin/${UserId}`)
    },

    async updateUser( UserId, UserData) {
        return apiFetch(`/admin/${UserId}`, {
            method: 'PATCH',
            body: JSON.stringify(UserData)
        });
    },

    async deleteUser( UserId){
        return apiFetch(`/admin/${UserId}`), {
            method: 'DELETE'
        }
    }
};