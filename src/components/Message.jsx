import React from "react";
import styled from "styled-components";

const MessageContainer = styled.div`
  margin: 20px 0 0 0;
  padding: 10px;
  border-radius: 15px;
  word-wrap: break-word;
  max-width: ${({ type }) => (type === "user" ? "70%" : "100%")};
  width: ${({ type }) => (type === "user" ? "auto" : "100%")};
  align-self: ${({ type }) => (type === "user" ? "flex-end" : "flex-start")};
  background-color: ${({ type }) => (type === "user" ? "#2F2B35" : "#484254")};
`;

const Message = ({ type, children }) => {
  return <MessageContainer type={type}>{children}</MessageContainer>;
};

export default Message;
