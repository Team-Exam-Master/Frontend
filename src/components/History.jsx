import axios from "../axios";
import React, { useEffect } from "react";
import useMessage from "../store/message";
import useHistory from "../store/history";

function History({ historyData }) {
  const setMessages = useMessage((state) => state.setMessages);
  const removeAllMessage = useMessage((state) => state.removeAllMessage);
  const histories = useHistory((state) => state.histories);
  const selectedHistoryId = useHistory((state) => state.selectedHistoryId);
  const setSelectedHistoryId = useHistory(
    (state) => state.setSelectedHistoryId
  );
  const deleteHistory = useHistory((state) => state.deleteHistory);
  const setHistories = useHistory((state) => state.setHistories);

  // loader로 가져온 historyData 관리
  useEffect(() => {
    if (Array.isArray(historyData)) {
      setHistories(historyData);
    } else {
      console.error("히스토리목록 없음");
      setHistories([]);
    }
  }, [historyData]);

  const handleHistoryClick = async (historyId) => {
    try {
      setSelectedHistoryId(historyId);

      // 현재 메시지 상태를 초기화
      removeAllMessage();

      // 서버에서 새로운 프롬프트 리스트를 가져옴
      const response = await axios.get(`prompt/list/${historyId}`);
      const promptList = response.data;

      // 새로운 메시지 리스트 생성
      // flatMap은 다차원배열을 일차원배열로 변환하는 함수
      // ex) [1,2,3][4,5,6] => [1,2,3,4,5,6]
      const formattedMessages = promptList.flatMap((item) => [
        {
          type: "user",
          content: item.prompt,
          imageUrl: "https://weasel-images.s3.amazonaws.com/" + item.photo, // 실제 Storage 경로로 변경 필요
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
    deleteHistory(historyId);
    if (selectedHistoryId === historyId) {
      setMessages([]);
      setSelectedHistoryId("");
    }
    await axios.delete(`history/delete/${historyId}`); // PathVariable인 경우 경로
    // await axios.delete(`history/delete?historyId=${historyId}`); // requestParam인 경우 경로
  };

  const newChatting = () => {
    setMessages([]);
    setSelectedHistoryId("");
  };

  return (
    <div className="flex flex-col text-center justify-center">
      <img
        src="/weasel.png"
        alt="Image"
        className="w-36 h-36 mx-auto rounded-full mt-6"
      />
      <div className="m-4">당신의 척척박사 위즐</div>
      <div
        onClick={() => newChatting()}
        className="flex flex-row  m-2 p-2 rounded cursor-pointer hover:bg-gray-700"
      >
        <a className="mr-1">New Chatting</a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </div>
      <div className="overflow-y">
        {histories.map((history) => (
          <div
            key={history.historyId}
            onClick={() => handleHistoryClick(history.historyId)}
            className="flex flex-row m-2 p-2 rounded justify-between items-center hover:bg-gray-700 hover:drop-shadow-[0_2px_4px_rgba(43, 40, 47, 1)]"
          >
            <a className="flex-grow text-left">{history.title}</a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteHistory(history.historyId);
              }}
              className="ml-2 px-2 py-1 text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
