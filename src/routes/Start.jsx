import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled Components로 버튼 스타일 정의
const StyledButton = styled.button`
  background-color: ${(props) => (props.primary ? "#F59E0B" : "#374151")};
  color: ${(props) => (props.primary ? "#000" : "#FFF")};
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#FBBF24" : "#1F2937")};
  }
`;

// Styled Components로 이미지 스타일 정의
const StyledImage = styled.img`
  width: 8rem;
  height: 8rem;
  object-cover: cover;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    width: 10rem;
    height: 10rem;
  }

  @media (min-width: 1024px) {
    width: 12rem;
    height: 12rem;
  }

  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
    drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
    drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
`;

function Start() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end text-white">
      <StyledImage src="/logo.png" alt="Logo" />

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center">
        Welcome to Weasel
      </h1>
      <p className="text-lg md:text-xl mb-3 text-center">
        Send a prompt and get instant answers and explanations to your
        questions!
      </p>

      <StyledButton primary>
        <Link to="/auth" className="no-underline">
          Get Started
        </Link>
      </StyledButton>

      <button>
        <Link to="/home">home</Link>
      </button>
    </main>
  );
}

export default Start;
