import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import EditProfileModal from "./EditProfileModal"; // 모달 컴포넌트 임포트

const INITIAL_USER_PROFILE = {
  name: "Guest",
  email: "guest@example.com",
  photoUrl: null,
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { status, data } = await axios.get("/api/member/profilePicture");
        if (status === 200 && data) {
          setIsLoggedIn(true);
          setUserProfile(data);
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류 발생:", error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      setIsLoggedIn(false);
      setUserProfile(INITIAL_USER_PROFILE);
      navigate("/auth");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃에 실패했습니다. 다시 시도하십시오.");
    }
  };

  const handleUpdate = async () => {
    // 프로필 업데이트 시 호출하여 최신 정보를 가져옵니다.
    try {
      const { data } = await axios.get("/api/member/profilePicture");
      setUserProfile(data);
    } catch (error) {
      console.error("프로필 갱신 중 오류 발생:", error);
    }
  };

  const renderDropdownMenu = () => (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none dark:bg-gray-700 dark:divide-gray-600 dark:border-gray-600 ${
        isDropdownOpen ? "block" : "hidden"
      }`}
    >
      <div className="px-4 py-3">
        <span className="block text-sm text-gray-900 dark:text-white">
          {userProfile.name}
        </span>
        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
          {userProfile.email}
        </span>
      </div>
      <ul className="py-2" aria-labelledby="user-menu-button">
        {isLoggedIn ? (
          <>
            <li>
              <span
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsModalOpen(true); // 모달 열기
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
              >
                Edit Profile
              </span>
            </li>
            <li>
              <span
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
              >
                Sign out
              </span>
            </li>
          </>
        ) : (
          <li>
            <span
              onClick={() => navigate("/auth")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
            >
              Login
            </span>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-transparent text-white">
      <div className="flex items-center">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Weasel
          </span>
        </a>
      </div>
      <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="sr-only">Open user menu</span>
          <div
            className="w-8 h-8 rounded-full"
            style={{
              backgroundImage: userProfile.photoUrl
                ? `url(${userProfile.photoUrl})`
                : "none",
              backgroundColor: userProfile.photoUrl
                ? "transparent"
                : "#d1d5db",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </button>
        {renderDropdownMenu()}
      </div>

      {isModalOpen && (
        <EditProfileModal
          userProfile={userProfile}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </nav>
  );
};

export default Header;
