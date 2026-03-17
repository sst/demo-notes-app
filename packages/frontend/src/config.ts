const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  AUTH_URL: import.meta.env.VITE_AUTH_URL,
  API_URL: import.meta.env.VITE_API_URL.slice(0, -1),
};

export default config;
