import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ onClose, onUpdate }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 폼이 제출되고 있는 중인지 여부를 관리
  const [memberId, setMemberId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 사용자 프로필 데이터를 서버에서 가져옴
        const response = await axios.get(
          "https://weasel-backend.kkamji.net/v1/member/view",
          { withCredentials: true } 
        );

        const userProfile = response.data;
        setEmail(userProfile.email);
        setMemberId(userProfile.id);
        setPhotoPreview(userProfile.photoUrl || "/default.png");
      } catch (error) {
        console.error("프로필 데이터를 가져오는 중 오류 발생:", error);

        if (error.response && error.response.status === 401) {
          alert("인증에 실패했습니다. 다시 로그인해 주세요.");
         // navigate("/auth");
        } else {
          alert(
            "프로필 데이터를 가져오는 데 실패했습니다. 서버 오류가 발생했습니다."
          );
        }
      }
    };

    fetchProfileData(); // 컴포넌트가 마운트될 때 사용자 프로필 데이터를 가져옴
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePhoto(file);

      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
      setProfilePhoto(null);
      setPhotoPreview(null);
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    if (newPassword) formData.append("password", newPassword);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    try {
      setIsSubmitting(true);

      // FormData 데이터를 서버에 전송
      const { data } = await axios.patch(
        "https://weasel-backend.kkamji.net/v1/member/update",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // FormData 전송을 위해 필요
          },
        }
      );

      if (data) {
        setPhotoPreview(data.photoUrl); // 서버에서 반환된 새로운 데이터로 프로필 사진 갱신
        alert("프로필이 성공적으로 업데이트되었습니다.");
      }

      onUpdate(); // 부모 컴포넌트에게 업데이트 완료를 알림
      onClose();
    } catch (error) {
      console.error("프로필 업데이트 중 오류 발생:", error);
      alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 dark:bg-gray-800 text-gray-100 rounded-lg p-6 sm:p-8 w-full max-w-md sm:max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Edit profile
        </h2>

        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profilePhoto"
            />
            <label
              htmlFor="profilePhoto"
              className="block text-lg font-bold text-gray-200 mb-4 cursor-pointer"
            >
              Profile photo
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
              onClick={() => document.getElementById("profilePhoto").click()}
            >
              New profile photo
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

          <div className="w-full mb-8">
            <label className="block text-lg font-bold text-gray-200 mb-2">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-black p-2"
            />
          </div>
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
            disabled={isSubmitting || (!profilePhoto && !newPassword)}
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
