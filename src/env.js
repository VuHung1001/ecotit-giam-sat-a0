export default {
    VITE_SERVER_URL: document.getElementById("app_config").getAttribute('VITE_SERVER_URL'), //import.meta.env.VITE_BASE_SRC // "http://localhost:5000",
    BASE_URL: document.getElementById("app_config").getAttribute('BASE_URL'),
    VITE_BASE_SRC: document.getElementById("app_config").getAttribute('VITE_BASE_SRC'),
    VITE_CHATBOT_URL: document.getElementById("app_config").getAttribute('VITE_CHATBOT_URL')
}