import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [history, setHistory] = useState([]); 
  const [cookies] = useCookies(["history"]);

  useEffect(() => {
    if (cookies.history) {
      setHistory(JSON.parse(cookies.history)); // 쿠키에서 history 데이터를 가져와서 상태에 저장
    }
  }, [cookies.history]);

  const toggleAuthMode = () => setIsLogin(!isLogin);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
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

  const value = {
    isLogin,
    email,
    password,
    profilePicture,
    photoPreview,
    history,
    setEmail,
    setPassword,
    toggleAuthMode,
    handleFileChange,
    setHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
