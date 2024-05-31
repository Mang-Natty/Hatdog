import axios from "axios";

const ApiManager = axios.create({
  baseURL: "exp://192.168.1.113:8081/api",
  responseType: "json",
  withCredentials: true,
});

export default ApiManager;
