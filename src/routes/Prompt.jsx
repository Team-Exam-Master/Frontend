import { useState, useRef, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import InputContainer from "../components/InputContainer";
import Message from "../components/Message";
import styled from "styled-components";
import axios from "axios";

const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 8px;
  background-color: #484254;
  cursor: text;
`;

function Prompt() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isAxiosLoading, setIsAxiosLoading] = useState(false);
  const [historyId, setHistoryId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setIsAxiosLoading(true);

    if (input.trim() !== "" || previewImage) {
      const newMessage = {
        type: "user",
        content: input,
        imageUrl: previewImage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const formData = new FormData();
      // formData.append("promptDTO", JSON.stringify(input));
      formData.append("promptDTO", "{'prompt': 'testetetetetetete'}");

      const file = fileInputRef.current?.files[0];
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("file", null);
      }

      setInput("");
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      try {
        // 서버에 메시지 전달
        const response = await JSON.parse(
          axios.post(
            "http://weasel.kkamji.net/prompt/add?historyId=",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data; boundary=<calculated when request is sent>",
              },
            }
          )
        );

        // 응답값 가공
        const botResponse = {
          type: "bot",
          content: response.data.prompt,
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

  const removePreviewImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gradient-to-r from-background-start via-gray-800 to-background-end text-white">
      <ChatContainer>
        {messages.map((msg, index) => (
          <Message key={index} type={msg.type}>
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="User upload"
                className="rounded w-1/2 h-50"
              />
            )}
            {msg.content && <p>{msg.content}</p>}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatContainer>
      <form className="w-1/2 mb-10" onSubmit={sendMessage}>
        <InputContainer>
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
          {previewImage && <img src={previewImage} alt="Preview" />}
          {previewImage && (
            <button type="button" onClick={removePreviewImage}>
              ×
            </button>
          )}

          <StyledInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
