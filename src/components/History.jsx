import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

function History() {
  const historyList = useLoaderData();
  const [historyId, setHistoryId] = useState(null);
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    // `historyList`가 변경될 때마다 `histories`를 업데이트
    setHistories(historyList);
  }, [historyList]);

  const handleDelete = (id) => {
    // 항목 삭제 로직: 예를 들어, `id`를 사용하여 필터링
    setHistories((prevHistories) =>
      prevHistories.filter((his) => his.id !== id)
    );
    // 서버에 삭제 요청을 보낼 수도 있음
  };

  const handleSelect = (id) => {
    setHistoryId(id);
  };

  const handleNewPrompt = async () => {
    // 서버에 새 프롬프트 요청
    try {
      const response = await fetch("/api/new-prompt", { method: "POST" });
      if (response.ok) {
        const newHistory = await response.json();
        setHistories((prevHistories) => [...prevHistories, newHistory]);
        setHistoryId(newHistory.id); // 새로 생성된 히스토리를 선택
      } else {
        console.error("Failed to create new prompt");
      }
    } catch (error) {
      console.error("Error creating new prompt:", error);
    }
  };

  const selectedHistory = histories.find((his) => his.id === historyId);

  return (
    <div className="flex flex-col text-center justify-center m-6">
      <img
        src="/weasel.png"
        alt="Image"
        className="w-36 h-36 mx-auto rounded-full"
      />
      <div className="m-4">느그의 척척박사 위즐</div>
      <button
        onClick={handleNewPrompt}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        새 프롬프트
      </button>
      {histories.map((his) => (
        <div
          key={his.id}
          className="flex-row m-2 flex items-center justify-between"
        >
          <div className="flex-start">{his.content}</div>
          <button
            onClick={() => handleSelect(his.id)}
            className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
          >
            보기
          </button>
          <button
            onClick={() => handleDelete(his.id)}
            className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            삭
          </button>
        </div>
      ))}
      {selectedHistory && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold">선택된 히스토리</h3>
          <p>{selectedHistory.content}</p>
        </div>
      )}
    </div>
  );
}

export default History;
