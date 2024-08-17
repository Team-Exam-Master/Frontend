import axios from "axios";

// Axios 기본 설정
axios.defaults.baseURL = "https://weasel-backend.kkamji.net/v1"; // 서버 URL
axios.defaults.withCredentials = true; // 쿠키와 함께 요청 전송

export default axios;
