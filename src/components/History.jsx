import axios from "../axios";
import React, { useState, useEffect } from "react";
import useStore from "./store"; // zustand store import

function History({ historyData }) {
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [histories, setHistories] = useState([]);
  const setMessages = useStore((state) => state.setMessages);
  const removeAllMessage = useStore((state) => state.removeAllMessage);

  useEffect(() => {
    if (Array.isArray(historyData)) {
      setHistories(historyData);
    } else {
      console.error("히스토리목록 없음");
      setHistories([]);
    }
  }, [historyData]);

  const handleHistoryClick = async (historyId) => {
    setSelectedHistoryId(historyId);

    try {
      // 현재 메시지 상태를 초기화
      removeAllMessage();

      // 서버에서 새로운 프롬프트 리스트를 가져옴
      const response = await axios.get("prompt/list/" + historyId);
      const promptList = response.data;

      // 새로운 메시지 리스트 생성
      // flatMap은 다차원배열을 일차원배열로 변환하는 함수
      // ex) [1,2,3][4,5,6] => [1,2,3,4,5,6]
      const formattedMessages = promptList.flatMap((item) => [
        {
          type: "user",
          content: item.prompt,
          imageUrl: null, // 실제 Storage 경로로 변경 필요
        },
        {
          type: "bot",
          content: item.answer,
          imageUrl: null,
        },
      ]);

      // 메시지 상태를 새로운 리스트로 업데이트
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  const handleDeleteHistory = async (historyId) => {
    console.log(historyId);
    const response = await axios.delete("history/delete/" + historyId);
    setHistories(
      histories.filter((history) => history.historyId !== historyId)
    );
  };

  return (
    <div className="flex flex-col text-center justify-center">
      <img
        src="/weasel.png"
        alt="Image"
        className="w-36 h-36 mx-auto rounded-full mt-6"
      />
      <div className="m-4">당신의 척척박사 위즐</div>
      {histories.map((history) => (
        <div
          key={history.historyId}
          onClick={() => handleHistoryClick(history.historyId)}
          className="flex flex-row m-2 p-2 border rounded justify-between items-center"
        >
          <a className="flex-grow text-left">{history.title}</a>
          <button
            onClick={() => handleDeleteHistory(history.historyId)}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default History;
