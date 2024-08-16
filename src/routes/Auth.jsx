import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useAuth } from "../components/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import "../index.css";

// Auth 컴포넌트 정의
const Auth = () => {
  
  const {
    isLogin,            
    email,              
    profilePicture,     // 프로필 사진 상태
    photoPreview,       // 프로필 사진 미리보기 URL 상태
    setEmail,          
    setPassword,        
    toggleAuthMode,     // 로그인/회원가입 모드를 토글하는 함수
    handleFileChange,   // 파일 선택을 처리하는 함수
  } = useAuth();

  // 쿠키를 사용하기 위한 Hook
  const [cookies, setCookie] = useCookies([
    "authToken",        // 인증 토큰 쿠키
    "email",            
    "profilePicture",   
    "history",          
  ]);

  // 페이지 이동을 위한 useNavigate Hook
  const navigate = useNavigate();

  // 로그인이 되어있다면 바로 홈으로
  // useEffect(() => {
  //   if (cookies.authToken) {
  //     navigate("/home");
  //   }
  // }, [cookies.authToken, navigate]);

  // 이메일이 유효성 검사 함수
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 로그인 또는 회원가입 요청을 처리 함수
  const handleAuth = async (e) => {
    e.preventDefault(); // 기본 form 제출 동작막음

   
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    
    if (!isValidEmail(email)) {
      alert("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    // 로그인 또는 회원가입 API의 URL
    const url = isLogin
      ? "https://weasel-backend.kkamji.net/v1/login"
      : "https://weasel-backend.kkamji.net/v1/member/join";

    // 서버로 전송할 데이터.
    const data = {
      email: email,
      password: password,
    };

 
    const formData = new FormData();
    formData.append("memberDTOstr", JSON.stringify(data));

    // 프로필 사진이 있을 경우 FormData에 파일을 추가.
    if (profilePicture) {
      formData.append("file", profilePicture);
    }

    try {
      // API 요청을 전송
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json", // JSON 형식의 데이터를 보내기.
        },
      });

     
      if (response.status === 200) {
        const { token, history } = response.data;

        // 인증 토큰, 이메일, 프로필 사진, 활동 기록을 쿠키에 저장. 저장기간은 1주일
        setCookie("authToken", token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
        setCookie("email", email, { path: "/", maxAge: 7 * 24 * 60 * 60 });
        setCookie("profilePicture", profilePicture, {
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
        setCookie("history", JSON.stringify(history), {
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        // 홈 화면으로 이동합니다.
        navigate("/home");
      } else {
        alert("인증 실패"); 
      }
    } catch (error) {
     
      if (error.response) {
        console.error("서버 응답 오류:", error.response.data);
      } else if (error.request) {
        console.error("서버에 요청 전송 실패:", error.request);
      } else {
        console.error("설정 오류:", error.message);
      }
    }
  };

  return (
    // 전체 화면을 차지하는 인증 페이지 컨테이너
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
        onClick={() => navigate("/")} 
      >
        <FaArrowLeft size={20} />
      </button>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"} 
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          {!isLogin && ( // 회원가입 일때만 프로필 사진 업로드 섹션을 표시
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])} // 파일 선택 시 handleFileChange 호출
                className="hidden"
                id="profilePicture"
              />
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 text-sm font-bold mb-2 text-center cursor-pointer"
              >
                Profile Photo
              </label>
              <div className="mt-2">
                {!photoPreview ? ( // 프사 미리보기가 없는 경우 기본 배경을 표시
                  <div className="w-40 h-40 m-auto rounded-full shadow bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500"></span>
                  </div>
                ) : (
                  // 프사 미리보기 없는 경우 사진을 원형으로 표시
                  <div
                    className="w-40 h-40 m-auto rounded-full shadow"
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundImage: `url(${photoPreview})`,
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2"
                onClick={() =>
                  document.getElementById("profilePicture").click()
                }
              >
                Select New Photo 
              </button>
            </div>
          )}
          <input
            type="email"
            placeholder="Email" // 이메일 입력 필드
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력 시 상태 업데이트
            className="border rounded-lg p-2"
          />
          <input
            type="password"
            placeholder="Password" // 비밀번호 입력 필드
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력 시 상태 업데이트
            className="border rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"} 
          </button>
        </form>
        <button
          onClick={toggleAuthMode}
          className="mt-4 text-gray-500 hover:underline"
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"} 
        </button>
      </div>
    </div>
  );
};

export default Auth;
