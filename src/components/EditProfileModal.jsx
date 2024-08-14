import React, { useState, useEffect } from "react";
import axios from "axios";

// EditProfileModal 컴포넌트 정의
const EditProfileModal = ({ userProfile, onClose, onUpdate }) => {
  // 상태 변수 선언
  const [email, setEmail] = useState(""); 
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [profilePicture, setProfilePicture] = useState(null); // 프로필 사진 파일
  const [photoPreview, setPhotoPreview] = useState(null); // 프로필 사진 미리보기 URL
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 검증 상태
  const [passwordError, setPasswordError] = useState(null); // 비밀번호 검증 오류 메시지

  // 컴포넌트가 마운트될 때 프로필 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 인증 토큰 가져오기
        if (!token) {
          alert("로그인 후 프로필을 수정할 수 있습니다."); 
          return;
        }

        // 인증 토큰을 사용하여 사용자 프로필 데이터를 가져오기
        const response = await axios.get("https://weasel-backend.kkamji.net/member/profilePicture", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = response.data; // 프로필 데이터
        setEmail(userProfile.email); // 이메일 설정
        setPhotoPreview(userProfile.photoUrl || "/default-avatar.png"); // 사진 미리보기 URL 설정
      } catch (error) {
        console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
        alert("프로필 데이터를 가져오는 데 실패했습니다."); // 오류 발생 시 경고
      }
    };

    fetchProfileData(); // 프로필 데이터 가져오기 호출
  }, []);

  // 파일 선택 이벤트 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일
    if (file && file.type.startsWith("image/")) {
      
      setProfilePicture(file); // 선택된 파일을 상태에 저장

      // 파일 리더를 사용하여 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target.result); // 미리보기 URL 설정
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다."); // 이미지 파일이 아니면 경고
      setProfilePicture(null); // 상태 초기화
      setPhotoPreview(null);
    }
  };

  // 현재 비밀번호 검증 함수
  const verifyCurrentPassword = async () => {
    try {
      const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 인증 토큰 가져오기
      if (!token) {
        alert("로그인 후 비밀번호를 검증할 수 있습니다."); // 토큰이 없으면 경고
        return;
      }

      // 현재 비밀번호를 검증하기 위한 요청
      const response = await axios.post(
        "https://weasel-backend.kkamji.net/member/password",
        { password: currentPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.verified) {
        setIsPasswordVerified(true); // 비밀번호 검증 성공 시 상태 업데이트
        setPasswordError(null); // 오류 메시지 초기화
      } else {
        setPasswordError("현재 비밀번호가 일치하지 않습니다."); // 비밀번호 오류 메시지 설정
      }
    } catch (error) {
      console.error("비밀번호 검증 중 오류 발생:", error);
      setPasswordError(
        error.response?.data?.message || "비밀번호 검증 중 오류가 발생했습니다." // 오류 발생 시 메시지 설정
      );
    }
  };

  // 변경사항 저장 함수
  const handleSaveChanges = async () => {
    if (profilePicture && !isPasswordVerified) {
      alert("현재 비밀번호를 확인하십시오."); 
      return;
    }

    const formData = new FormData(); 
    if (newPassword) formData.append("newPassword", newPassword); // 새 비밀번호가 있으면 추가
    if (profilePicture) formData.append("profilePhoto", profilePicture); // 프로필 사진이 있으면 추가

    try {
      setIsSubmitting(true); // 제출 상태를 진행 중으로 설정
      const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 인증 토큰 가져오기
      if (!token) {
        alert("로그인 후 변경사항을 저장할 수 있습니다."); 
        return;
      }

      // 변경사항을 서버로 전송
      const response = await axios.post(
        "https://weasel-backend.kkamji.net/member/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 요청 헤더 설정
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
        }
      );

      if (response.status === 200) {
        onUpdate(); // 업데이트 성공 시 부모 컴포넌트의 업데이트 함수 호출
        onClose(); // 모달 닫기
      }
    } catch (error) {
      console.error("프로필 업데이트 중 오류 발생:", error);
      alert("프로필 업데이트에 실패했습니다. 다시 시도하십시오."); // 오류 발생 시 경고
    } finally {
      setIsSubmitting(false); // 제출 상태를 완료로 설정
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      {/* 모달의 배경과 전체 위치 설정 */}
      <div className="bg-gray-900 dark:bg-gray-800 text-gray-100 rounded-lg p-6 sm:p-8 w-full max-w-md sm:max-w-lg">
       
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profilePicture"
            />
            <label
              htmlFor="profilePicture"
              className="block text-lg font-bold text-gray-200 mb-4 cursor-pointer"
            >
              Profile Picture
            </label>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg bg-gray-700 flex items-center justify-center">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  className="w-full h-full object-cover"
                  alt="Profile Preview"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              onClick={() => document.getElementById("profilePicture").click()}
            >
              New Profile Picture
            </button>
          </div>

          <div className="w-full mb-6">
            <label className="block text-lg font-bold text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-gray-100 p-2"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-lg font-bold text-gray-200 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-100 p-2"
            />
            <button
              type="button"
              onClick={verifyCurrentPassword}
              className="mt-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              Verify Password
            </button>
            {passwordError && (
              <div className="text-red-400 mt-2">{passwordError}</div>
            )}
          </div>

          {isPasswordVerified && (
            <div className="w-full mb-8">
              <label className="block text-lg font-bold text-gray-200 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-100 p-2"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md bg-gray-700 px-4 py-2 text-lg font-medium text-gray-300 shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSubmitting || (!profilePicture && !newPassword)}
            className="inline-flex justify-center rounded-md bg-yellow-500 px-4 py-2 text-lg font-medium text-gray-900 shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
