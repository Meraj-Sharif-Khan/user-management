import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;

const httpServices = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
  };

  export default httpServices;