import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 5px;
  background-color: #484254;
  text-color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InputContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default InputContainer;
