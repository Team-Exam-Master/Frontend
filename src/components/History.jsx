import React, { useState, useEffect } from "react";

function History() {
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    if (Array.isArray(historyData)) {
      setHistories(historyData);
    } else {
      console.error("히스토리목록 없음");
      setHistories([]);
    }
  }, [historyData]);

  const handleHistoryClick = (historyId) => {
    setSelectedHistoryId(historyId);
  };

  const handleDeleteHistory = (historyId) => {
    setHistories(
      histories.filter((history) => history.historyId !== historyId)
    );
  };

  return (
    <div className="flex flex-col text-center justify-center m-6">
      <img
        src="/weasel.png"
        alt="Image"
        className="w-36 h-36 mx-auto rounded-full"
      />
      <div className="m-4">느그의 척척박사 위즐</div>
      {histories.map((history) => (
        <div
          key={history.historyId}
          className="flex flex-col m-2 border p-2 rounded"
        >
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleHistoryClick(history.historyId)}
              className={`flex-grow text-left ${
                selectedHistoryId === history.historyId ? "font-bold" : ""
              }`}
            >
              {history.title}
            </button>
            <button
              onClick={() => handleDeleteHistory(history.historyId)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;
