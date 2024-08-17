import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
// import { useCookies } from "react-cookie";
import { FaArrowLeft } from "react-icons/fa";
import "../index.css";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => setIsLogin(!isLogin);

  const handleFileChange = (file) => {
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return {
    isLogin,
    email,
    password,
    profilePhoto,
    photoPreview,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
  };
};

const Auth = () => {
  const {
    isLogin,
    email,
    password,
    profilePhoto,
    photoPreview,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
  } = useAuth();

  // const [cookies, setCookie] = useCookies([
  //   "authToken",
  //   "email",
  //   "profilePhoto",
  //   "history",
  // ]);

  const navigate = useNavigate();

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

    if (isLogin) {
      try {
        const response = await axios.post(
          "/login",
          { withCredentials: true },
          { email, password }
        );

        if (response.status === 200) {
          // 서버 응답에서 올바른 필드 접근
          const { resultCode, msg, profilePhoto } = response.data;

          if (resultCode === 1) {
            // resultCode가 1이면 성공으로 처리

            navigate("/home");
          } else {
            alert(msg || "로그인 실패");
          }
        } else {
          alert("로그인 실패");
        }
      } catch (error) {
        console.error("로그인 중 오류 발생:", error);
        alert("서버에 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      try {
        const data = {
          email: email,
          password: password,
        };

        const formData = new FormData();
        formData.append("memberDTOstr", JSON.stringify(data));

        if (profilePhoto) {
          formData.append("file", profilePhoto);
        }

        const response = await axios.post(
          "https://weasel-backend.kkamji.net/v1/member/join",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("회원가입 성공");
          toggleAuthMode();
        } else {
          alert("회원가입 실패");
        }
      } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        alert("서버에 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
