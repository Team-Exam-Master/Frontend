import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import WeaselIcon from "./WeaselIcon";
function History() {
  const historyList = useLoaderData();
  const [historyId, setHistoryId] = useState(null);
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    updateHistories();
  }, [histories]);

  const updateHistories = () => {};

  return (
    <div className="flex flex-col text-center justify-center m-6">
      <img
        src="/weasel.png"
        alt="Image"
        className="w-36 h-36 mx-auto rounded-full"
      />
      <div className="m-4">느그의 척척박사 위즐</div>
      {/* {histories.map((his, index) => (
        <div className="flex-row m-2">
          <div key={index} className="flex-start" />
          <button className="flex-end">삭</button>
        </div>
      ))} */}
    </div>
  );
}

export default History;
