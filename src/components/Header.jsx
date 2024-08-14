import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProfileModal from "./EditProfileModal"; // 모달 컴포넌트 임포트

// 초기 사용자 프로필 정보 설정
const INITIAL_USER_PROFILE = {
  name: "Guest",
  email: "guest@example.com",
  photoUrl: null,
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리 상태 변수
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE); // 프로필 정보 관리 상태 변수
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 메뉴 상태 관리 상태 변수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const dropdownRef = useRef(null); // 드롭다운 메뉴의 DOM 요소에 접근하기 위한 ref 변수
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  // 컴포넌트가 처음 렌더링될 때 한번 실행되는 useEffect
  useEffect(() => {
    const savedUserProfile = JSON.parse(localStorage.getItem("profilePciture"));
    const token = localStorage.getItem("authToken");

    if (savedUserProfile && token) {
      setIsLoggedIn(true);
      setUserProfile(savedUserProfile);
    } else {
      // 로그인 상태를 확인하는 비동기 함수
      const checkLoginStatus = async () => {
        try {
          // 사용자의 프로필 정보를 가져오는 API 엔드포인트
          const { status, data } = await axios.get("https://weasel-backend.kkamji.net/member/view", {
            headers: { Authorization: `Bearer ${token}` },
          });
          // 정상적으로 응답을 받으면 사용자 사용자 정보를 상태에 저장
          if (status === 200 && data) {
            setIsLoggedIn(true);
            setUserProfile(data);
            localStorage.setItem("userProfile", JSON.stringify(data)); // 프로필 정보를 localStorage에 저장
          }
        } catch (error) {
          console.error("로그인 상태 확인 중 오류 발생:", error);
        }
      };

      checkLoginStatus();
    }
  }, []);

  // 드롭다운 메뉴가 열려 있을 때, 화면 밖의 클릭을 감지하는 useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 로그아웃 버튼을 클릭했을 때 호출
  const handleLogout = async () => {
    try {
      await axios.post("https://weasel-backend.kkamji.net/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // HTTP 요청을 보낼 때 Authorization 헤더에 인증 토큰을 포함시키는 역할
      });
      setIsLoggedIn(false);
      setUserProfile(INITIAL_USER_PROFILE);
      localStorage.removeItem("authToken");
      localStorage.removeItem("profilePicture");
      navigate("/auth");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  const handleUpdate = async () => {
    // 프로필 업데이트 시 호출하여 최신 정보를 가져옵니다.
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get("https://weasel-backend.kkamji.net/member", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(data);
      localStorage.setItem("profilePicture", JSON.stringify(data)); // 프로필 정보를 localStorage에 저장
    } catch (error) {
      console.error("프로필 갱신 중 오류 발생:", error);
    }
  };

  const renderDropdownMenu = () => (
    <div
      ref={dropdownRef} // 메뉴에 대한 'ref'를 설정하여 외부 클릭을 감지할 수 있게함
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

  if (window.location.pathname === "/") return null; // 사용자가 루트 페이지에 있을 때 헤더가 표시되지 않도록 함

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
              backgroundColor: userProfile.photoUrl ? "transparent" : "#d1d5db",
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
