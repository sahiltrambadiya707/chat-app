import axios from "axios";

const axiosIntense = axios.create({
  baseURL: "http://localhost:3001/api/",
});

export default axiosIntense;
