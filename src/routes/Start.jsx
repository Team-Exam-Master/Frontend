import { Link } from "react-router-dom";
import styled from "styled-components";
import WeaselIcon from "../components/WeaselIcon";

// Styled Components로 버튼 스타일 정의
const StyledButton = styled.button`
  background-color: #f59e0b;
  color: #000;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#FBBF24" : "#1F2937")};
    color: #fff;
  }
`;

// Styled Components로 이미지 스타일 정의

function Start() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-background-start via-gray-700 to-background-end text-white">
      <WeaselIcon className="w-48 h-48" />

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center">
        Welcome to Weasel
      </h1>
      <p className="text-lg md:text-xl mb-3 text-center">
        Send a prompt and get instant answers and explanations to your
        questions!
      </p>

      <StyledButton as={Link} to="/auth">
        Get Started
      </StyledButton>

      <button>
        <Link to="/home">home</Link>
      </button>
    </main>
  );
}

export default Start;
