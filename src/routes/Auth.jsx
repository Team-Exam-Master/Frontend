import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios를 import하여 HTTP 요청을 처리
import "../index.css"; // Tailwind CSS 파일을 import

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // 로그인 상태를 관리하는 상태 변수. 기본값은 true로 설정되어 로그인 상태로 시작.
  const [email, setEmail] = useState(""); // 이메일 입력 값을 관리하는 상태 변수
  const [password, setPassword] = useState(""); // 비밀번호 입력 값을 관리하는 상태 변수
  const [profilePicture, setProfilePicture] = useState(null); // 프로필 사진 파일을 관리하는 상태 변수. 기본값은 null
  const [photoPreview, setPhotoPreview] = useState(null); // 프로필 사진 미리보기를 관리하는 상태 변수. 기본값은 null
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 훅

  // 이메일 유효성 검사 함수
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 폼 제출 시 로그인 또는 회원가입 요청을 처리하는 함수
  const handleAuth = async (e) => {
    e.preventDefault(); // 폼을 제출할때마다 리로드 하는 것을 막아줌

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    // 로그인 상태에 따라 요청 URL을 설정
    const url = isLogin
      ? "https://weasel.kkamji.net/v2/login" // backend와 맞춰서 변경 예정
      : "https://weasel.kkamji.net/v2/signup"; // backend와 맞춰서 변경 예정

    // 서버로 전송할 데이터를 FormData 객체에 추가
    const formData = new FormData();
    formData.append("email", email); // 이메일을 FormData에 추가
    formData.append("password", password); // 비밀번호를 FormData에 추가

    // 프로필 사진이 선택된 경우에만 FormData에 추가
    if (profilePicture) {
      formData.append("profilePicture", profilePicture); // 프로필 사진 파일을 FormData에 추가
    }

    try {
      // Axios를 사용하여 POST 요청을 보냄. URL과 FormData를 인자로 전달
      const response = await axios.post(url, formData);

      // 요청이 성공하면 '/prompt' 페이지로 이동
      if (response.status === 200) {
        navigate("/prompt");
      } else {
        // 요청이 실패시 alert창 표시
        alert("인증 실패");
      }
    } catch (error) {
      // 요청 중 오류가 발생한 경우 alert창 표시
      console.error("인증 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도하십시오.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; //파일 input 엘리먼트에서 첫 번째 파일을 가져옴
    if (file && file.type.startsWith("image/")) {
      //파일이 존재하고(file) 파일의 유형이 이미지인지 확인
      setProfilePicture(file);

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
      setProfilePicture(null);
      setPhotoPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end">
      {/* 전체 페이지를 가운데 정렬하고 배경색과 패딩을 설정. */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* 인증 폼을 담고 있는 컨테이너입니다. 배경색, 패딩, 그림자, 최대 너비를 설정. */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        {/* 현재 상태에 따라 제목을 "Login" 또는 "Sign Up"으로 표시. */}
        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          {/* 로그인 상태가 아닐 때만 프로필 사진 업로드 필드를 표시. */}
          {!isLogin && (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
                {!photoPreview ? (
                  <div className="w-40 h-40 m-auto rounded-full shadow bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500"></span>
                  </div>
                ) : (
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 입력 시 상태를 업데이트.
            className="border rounded-lg p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 시 상태를 업데이트.
            className="border rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          {/* 현재 상태에 따라 버튼 텍스트를 "Login" 또는 "Sign Up"으로 표시 */}
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)} // 로그인/회원가입 상태 전환 버튼.
          className="mt-4 text-gray-500 hover:underline"
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
        {/* 현재 상태에 따라 버튼 텍스트를 "Switch to Sign Up" 또는 "Switch to Login"으로 표시. */}
      </div>
    </div>
  );
};

export default Auth;
