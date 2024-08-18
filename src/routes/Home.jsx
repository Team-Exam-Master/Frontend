import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

import Prompt from "../components/Prompt";
import History from "../components/History";
import styled from "styled-components";
import Header from "../components/Header";
import axios from "../axios";

const SidebarContainer = styled.div`
  position: relative;
`;

const Sidebar = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? "20vw" : "0")};
  transition: width 0.3s;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  height: 10vh;
  background-color: #374151;
  padding: 0px;
  border-radius: 0 4px 4px 0;
  &:hover {
    background-color: #4b5563;
  }
  &:focus {
    outline: none;
  }
`;

const ToggleIcon = styled.svg`
  width: 25px;
  height: 25px;
  transform: ${({ $isOpen }) => ($isOpen ? "none" : "rotate(180deg)")};
`;

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid white;
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: auto;
`;

const Home = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const historyData = useLoaderData();

  // 히스토리 토글 함수
  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="flex w-screen h-screen bg-gradient-to-r from-background-start via-gray-800 to-background-end text-white overflow-hidden">
      <SidebarContainer>
        <Sidebar $isOpen={isHistoryOpen}>
          <History historyData={historyData} />
        </Sidebar>
        <ToggleButton onClick={toggleHistory}>
          <ToggleIcon
            $isOpen={isHistoryOpen}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </ToggleIcon>
        </ToggleButton>
      </SidebarContainer>
      <MainContainer>
        <Header />
        <Content>
          <Prompt />
        </Content>
      </MainContainer>
    </div>
  );
};

export default Home;

export async function loader() {
  try {
    const response = await axios.get("/history/list");
    return response.data;
  } catch (error) {
    console.error("Loader error:", error);
    return [];
  }
}
