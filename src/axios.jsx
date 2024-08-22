import axios from "axios";

// Axios 기본 설정
//axios.defaults.baseURL = "https://weasel-backend.kkamji.net/v1"; // 서버 URL
axios.defaults.baseURL = "http://localhost:8080/v1"; // 테스트용 로컬 URL
axios.defaults.withCredentials = true; // 쿠키와 함께 요청 전송

export default axios;
