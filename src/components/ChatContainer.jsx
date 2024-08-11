import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 50%;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 60%;
    padding: 10px;
  }
`;

const ChatContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ChatContainer;
