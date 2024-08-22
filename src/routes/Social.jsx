import React from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Social() {
  const navigate = useNavigate();
  const response = axios.get("/social/loginSuccess");
  console.log(response);
  console.log("---");
  console.log(response.data);
  if (response.status === 200) {
    if (response.data.resultCode === 1) {
      alert("로그인 성공");
      navigate("/home");
    } else if (response.data.resultCode === -1) {
      alert("아이디나 비밀번호가 틀렸습니다.");
    } else {
      alert("로그인 실패: " + response.data.msg);
    }
  }

  return <div>빈 페이지</div>;
}

export default Social;
