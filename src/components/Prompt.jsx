import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 60%;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid white;
  @media (max-width: 1024px) {
    width: 80%;
    padding: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 5px;
  background-color: #484254;
  text-color: #ffffff;
  height: 6vh;
  border: 1px solid white;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const Message = styled.div`
  margin: 20px 0 0 0;
  padding: 10px;
  border-radius: 15px;
  word-wrap: break-word;

  // 템플릿 리터럴 문법: '컴포넌트의 props'에 따라 동적으로 설정하는 문법
  // <Message key={index} type={msg.type}> 여기처럼 '컴포넌트'의 type을 지정해주어야 함.
  max-width: ${({ type }) => (type === "user" ? "70%" : "100%")};
  width: ${({ type }) => (type === "user" ? "auto" : "100%")};
  align-self: ${({ type }) => (type === "user" ? "flex-end" : "flex-start")};
  background-color: ${({ type }) => (type === "user" ? "#2F2B35" : "#484254")};
`;

const StyledTextarea = styled(TextareaAutosize)`
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: #484254;
  color: #ffffff;
  resize: none;
  overflow-y: auto;
  min-height: 24px;
  max-height: 150px;
`;

function Prompt() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isAxiosLoading, setIsAxiosLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing === false) {
        e.preventDefault();
        sendMessage(e);
      }
    }
  };

  // 렌더링될 때 마다 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // input안에 텍스트 또는 previewImage가 존재할때 newMessage를 set
    if (input.trim() !== "" || previewImage) {
      setIsAxiosLoading(true);

      const newMessage = {
        type: "user",
        content: input,
        imageUrl: previewImage,
      };

      // useState 훅을 사용하여 메세지 배열에 새 메세지 추가
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // formData에 전달값 세팅
      const formData = new FormData();
      formData.append("promptDTO", JSON.stringify({ prompt: input }));

      const file = fileInputRef.current?.files[0];
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("file", null);
      }

      // 입력값 초기화
      setInput("");
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      try {
        // 서버에 메시지 전달
        const response = await axios.post(
          "https://weasel.kkamji.net/prompt/add?historyId=",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data; boundary=<calculated when request is sent>",
            },
          }
        );

        // 응답값 가공
        const botResponse = {
          type: "bot",
          content: response.data.answer,
          imageUrl: null,
        };

        // 봇 응답 추가
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsAxiosLoading(false); // 로딩 상태 해제
      }
    }
  };

  // 이미지 업로드 함수
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 함수
  const removePreviewImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow">
      {/* 채팅 메세지 목록 */}
      <ChatContainer>
        {/* map 함수를 사용하여 메세지 배열 전체를 순회하여 렌더링 */}
        {messages.map((msg, index) => (
          <Message key={index} type={msg.type}>
            {/* 조건부 렌더링: && 연산자로 msg.imageUrl이 존재(!null)할때만 해당 소스의 이미지를 렌더링함 */}
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="User upload"
                className="rounded h-80"
              />
            )}
            {msg.content && (
              <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
            )}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatContainer>
      <form onSubmit={sendMessage} className="w-4/5 lg:w-3/5 mb-10">
        <InputContainer style={{ height: "auto" }}>
          {/* 이미지 선택버튼 */}
          {/* 아이콘 출처: heroicons.com */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 mx-2 cursor-pointer"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-12 h-12 rounded-sm"
            />
          )}
          {/* 이미지 제거 버튼 */}
          {previewImage && (
            <button type="button" className="ml-1" onClick={removePreviewImage}>
              X
            </button>
          )}

          <StyledTextarea
            value={input}
            // text값이 변경될 때마다 setInput값 변경
            // 변경될 때마다 set을 호출하는 방법 말고 다른 방법이 있었던 것 같은데.. 나중에 리팩토링 도전
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message or image..."
          />
          <button type="submit">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 mx-2 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
          {isAxiosLoading && <img src="/spinner.gif" className="size-10" />}
        </InputContainer>
      </form>
      <input
        type="file"
        onChange={handleImageUpload}
        className="mb-2 hidden"
        ref={fileInputRef}
      />
    </div>
  );
}

export default Prompt;
