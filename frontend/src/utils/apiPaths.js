export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },

    USER: {
        UPDATE_PROFILE: "/api/users/profile", // New route
    },
    

    TASKS: {
        GET_DASHBOARD: "/api/tasks/dashboard-data",
        GET_ALL_TASKS: "/api/tasks",
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
        CREATE_TASK: "/api/tasks",
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
        UPDATE_TASK_CHECKLIST: (taskId) => `/api/tasks/${taskId}/checklist`,
        TOGGLE_PINNED: (taskId) => `/api/tasks/${taskId}/pin`, // ✅ Added
    },

    IMAGE: {
        UPLOAD: "/api/uploads/upload-image",
    },
};
