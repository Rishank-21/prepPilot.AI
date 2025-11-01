// // export const BASE_URL = "http://localhost:5000";
// export const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const API_PATHS = {
//     AUTH : {
//         REGISTER: "/api/auth/register",
//         LOGIN : "/api/auth/login",
//         GET_PROFILE: "/api/auth/profile"
//     },
//     IMAGE: {
//         UPLOAD_IMAGE: "/api/auth/upload-image"
//     },
//     AI: {
//         GENERATE_QUESTIONS: "/api/ai/generate-questions",
//         GENERATE_EXPLANATION: "/api/ai/generate-explanation"
//     },
//     SESSION: {
//         CREATE: "/api/sessions/create",
//         GET_ALL: "/api/sessions/my-sessions",
//         GET_ONE: (id) => `/api/sessions/${id}`,
//         DELETE: (id) => `/api/sessions/${id}`,
//     },
//     QUESTION: {
//         ADD_TO_SESSION: "/api/questions/add",
//         PIN : (id) => `/api/questions/${id}/pin`,
//         UPDATE_NOTE : (id) => `/api/questions/${id}/note`
//     },
// }



// export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

// export const API_PATHS = {
//   AUTH: {
//     REGISTER: `${BASE_URL}/api/auth/register`,
//     LOGIN: `${BASE_URL}/api/auth/login`,
//     GET_PROFILE: `${BASE_URL}/api/auth/profile`,
//   },
//   IMAGE: {
//     UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
//   },
//   AI: {
//     GENERATE_QUESTIONS: `${BASE_URL}/api/ai/generate-questions`,
//     GENERATE_EXPLANATION: `${BASE_URL}/api/ai/generate-explanation`,
//   },
//   SESSION: {
//     CREATE: `${BASE_URL}/api/sessions/create`,
//     GET_ALL: `${BASE_URL}/api/sessions/my-sessions`,
//     GET_ONE: (id) => `${BASE_URL}/api/sessions/${id}`,
//     DELETE: (id) => `${BASE_URL}/api/sessions/${id}`,
//   },
//   QUESTION: {
//     ADD_TO_SESSION: `${BASE_URL}/api/questions/add`,
//     PIN: (id) => `${BASE_URL}/api/questions/${id}/pin`,
//     UPDATE_NOTE: (id) => `${BASE_URL}/api/questions/${id}/note`,
//   },
// };


export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },
  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },
  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
  },
};
