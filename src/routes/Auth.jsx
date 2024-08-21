import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { FaArrowLeft } from "react-icons/fa";
import "../index.css";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // 프로필 사진 미리보기 url 상태 관리
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 로그인 하는동안 버튼막기위해 사용

  // 로그인/회원가입 모드 전환
  const toggleAuthMode = () => setIsLogin(!isLogin);

  // 파일이 변경될때 호출
  const handleFileChange = (file) => {
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result); // 파일의 미리보기 URL을 photoPreview에 저장
    };
    reader.readAsDataURL(file); // 파일을 Data URL로 읽음
  };

  return {
    isLogin,
    email,
    password,
    profilePhoto,
    photoPreview,
    isSubmitting,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
    setIsSubmitting,
  };
};

const Auth = () => {
  const {
    isLogin,
    email,
    password,
    profilePhoto,
    photoPreview,
    isSubmitting,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
    setIsSubmitting,
  } = useAuth();

  const navigate = useNavigate();

  // 이메일 유효성 검사
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true); // 서버 요청이 시작될 때 버튼을 비활성화하기 위한 상태 설정

    try {
      let response;
      // json 형식
      // if (isLogin) {
      //   // 로그인 요청 처리
      //   response = await axios.post("/login", { email, password });

      //   // 응답 데이터 출력
      //   console.log("로그인 응답 데이터:", response.data);

      //   // 로그인 성공 시 처리
      //   if (response.status === 200 && response.data.resultCode === 1) {
      //     alert("로그인 성공");
      //     navigate("/home");
      //   } else {
      //     alert("로그인 실패: " + response.data.msg);
      //   }
      // }

      // formData형식
      if (isLogin) {
        // FormData 객체 생성
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
          // 로그인 요청 처리 (FormData로 전송)
          const response = await axios.post("/login", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // 응답 데이터 출력
          // console.log("로그인 응답 데이터:", response.data);

          // 로그인 성공 시 처리
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
        } catch (error) {
          // console.error("로그인 요청 중 오류 발생:", error);
          alert("로그인 요청 중 오류가 발생했습니다.");
        }
      } else {
        // 회원가입 요청 처리
        const data = { email, password };
        const formData = new FormData();
        formData.append("memberDTOstr", JSON.stringify(data)); // JSON 문자열로 변환하여 전송

        if (profilePhoto) {
          formData.append("file", profilePhoto);
        }

        response = await axios.post("/member/join", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const { resultCode } = response.data;

          if (resultCode === 1) {
            alert("회원가입 성공");
            toggleAuthMode();
          } else if (resultCode === -1) {
            alert("이미 가입된 회원입니다.");
          } else {
            alert("회원가입 실패: " + response.data.msg);
          }
        } else {
          alert("회원가입 실패");
        }
      }
    } catch (error) {
      // console.error("인증 중 오류 발생:", error);
      alert(
        error.response?.data?.message ||
          "서버에 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setIsSubmitting(false); // 서버 요청이 완료되면 버튼 활성화
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.post("/auth/login/google");
      if (response.status === 200) {
        const { redirectUrl } = response.data;
        console.log(redirectUrl);
        location.href = redirectUrl;
      }
    } catch (error) {}
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end">
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
          {!isLogin && (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
                id="profilePhoto"
              />
              <label
                htmlFor="profilePhoto"
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
                onClick={() => document.getElementById("profilePhoto").click()}
              >
                Select New Photo
              </button>
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2"
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-2 shadow-sm hover:bg-gray-100 transition"
            style={{
              backgroundImage: `url('google.png')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "200px",
              height: "50px",
            }}
          >
            <span className="sr-only">Google Login</span>
          </button>
        </form>

        <button
          onClick={toggleAuthMode}
          className="mt-4 text-gray-500 hover:underline"
          disabled={isSubmitting}
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
