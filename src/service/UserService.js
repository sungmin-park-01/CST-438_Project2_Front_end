import { apiFetch } from "../api";

export const UserService = {
    async getCurrentUser() {
        return apiFetch("/api/me");
    },

    async logout() {
        return apiFetch("/api/logout", {
            method: "POST"
        });
    },

    async deleteCurrentUser() {
        return apiFetch("/api/me", {
            method: "DELETE"
        });
    },

    async getAllUsers() {
        return apiFetch('/admin');
    },

    async getUser(userId) {
        return apiFetch(`/admin/${userId}`);
    },

    async updateUser(userId, userData) {
        return apiFetch(`/admin/${userId}`, {
            method: "PATCH",
            body: JSON.stringify(userData)
        });
    },

    async deleteUser(userId) {
        return apiFetch(`/admin/${userId}`, {
            method: "DELETE"
        });
    }
};
