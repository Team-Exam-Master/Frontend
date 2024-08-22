import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import EditProfileModal from "./EditProfileModal";

// 사용자 프로필의 초기 상태
const INITIAL_USER_PROFILE = {
  email: null,
  profilePhoto: null,
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE); // 사용자 프로필 정보를 관리하는 상태입니다
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null); // 드롭다운 메뉴의 참조를 관리하기 위한 ref
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { status, data } = await axios.get("/member/view");

        if (status === 200 && data) {
          setUserProfile({
            ...data,
            profilePhoto: data.profilePhoto
              ? `https://weasel-images.s3.amazonaws.com/${data.profilePhoto}`
              : "/default.png",
          });
          setIsLoggedIn(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("인증되지 않은 사용자입니다. 다시 로그인해 주세요.");
          navigate("/auth");
        } else {
        }
      }
    };

    fetchUserProfile(); // 컴포넌트 마운트 시 사용자 프로필을 가져오는 함수 호출
  }, [navigate]);

  // 드롭다운 메뉴 외부 클릭 감지 useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // 외부를 클릭하면 드롭다운 닫음
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃에 실패했습니다.");
    } finally {
      setIsLoggedIn(false); // 로그인 상태를 해제
      setUserProfile(INITIAL_USER_PROFILE);
      navigate("/auth");
    }
  };

  // 프로필 업데이트를 처리하는 함수
  const handleUpdate = async () => {
    try {
      const { status, data } = await axios.get("/member/view");

      if (status === 200 && data) {
        setUserProfile({
          ...data,
          profilePhoto: data.profilePhoto
            ? `https://weasel-images.s3.amazonaws.com/${data.profilePhoto}`
            : "/default.png",
        });
      }
    } catch (error) {
      console.error("프로필 갱신 중 오류 발생:", error);
    }
  };

  // 드롭다운 메뉴 렌더링 함수
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
        {userProfile.id && (
          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
            ID: {userProfile.id}
          </span>
        )}
      </div>
      <ul className="py-2" aria-labelledby="user-menu-button">
        <li>
          <span
            onClick={() => setIsModalOpen(true)}
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
            Logout
          </span>
        </li>
      </ul>
    </div>
  );

  // 루트 페이지, auth 페이지 헤더 숨기기
  if (window.location.pathname === "/") return null;
  if (window.location.pathname === "/auth") return null;

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-transparent text-white">
      <div className="flex items-center">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span
            className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            style={{ marginLeft: "10px" }}
          >
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
              backgroundImage: userProfile.profilePhoto
                ? `url('${userProfile.profilePhoto}')`
                : `url('/default.png')`,
              backgroundColor:
                userProfile.profilePhoto === "/default.png"
                  ? "#d1d5db"
                  : "transparent",
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
          onUpdate={handleUpdate} // 업데이트 후 호출할 함수
        />
      )}
    </nav>
  );
};

export default Header;
