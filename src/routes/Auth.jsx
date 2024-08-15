import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useAuth } from "../components/AuthContext";
import "../index.css";

const Auth = () => {
  const {
    isLogin,
    email,
    password,
    profilePicture,
    photoPreview,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
  } = useAuth();

  const [cookies, setCookie] = useCookies([
    "authToken",
    "email",
    "profilePicture",
    "history",
  ]);
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

    const url = isLogin
      ? "https://weasel-backend.kkamji.net/v1/login"
      : "https://weasel-backend.kkamji.net/v1/member/join";

    const data = {
      email: email,
      password: password,
    };

    if (!isLogin && profilePicture) {
      data.profilePicture = profilePicture; // base64 방식. 
    }

    try {
      const response = await axios.post(url, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { token, history } = response.data;

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

        navigate("/prompt");
      } else {
        alert("인증 실패");
      }
    } catch (error) {
      console.error("인증 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도하십시오.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end">
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
