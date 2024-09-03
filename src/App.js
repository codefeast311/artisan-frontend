import "./App.css";
import { useEffect, useRef, useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer/Footer";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import edit and delete icons from react-icons
import runChat from "./hooks/Gemini";

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null); // Reference to the chat container

  // Fetch chats from the backend
  const fetchChats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_CHAT_API}`);
      const formattedMessages = res.data.map((message) => ({
        type: message.sender,
        text: message.content,
        id: message.id,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to load the chats initially
  useEffect(() => {
    fetchChats();
  }, []);

  // Function to Scroll when ever a chat is done
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle the user input
  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  // Function to send the user message
  const sendUserMessage = async (userMessage) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_CHAT_API}`, {
        content: userMessage,
        sender: "user",
      });
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to send the Bot message
  const sendBotMessage = async (botMessage) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_CHAT_API}`, {
        content: botMessage,
        sender: "bot",
      });
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to format the response
  const formatMessage = (text) => {
    return text
      // Remove all instances of ", ', <, `
      .replace(/["'`]/g, "")
      // Replace repeated symbols like *** with a single occurrence
      .replace(/(\*+|\-+|\/+|\++)/g, (match) => match[0]);
  };

  // Function to handle the sending of a message
  const handleSendMessage = async () => {
    const userMessage = userInput.trim();
    if (!userMessage) return;

    // Set loading state and display user input and loading message
    setIsLoading(true);

    const loadingMessage = "..."; // Bot's loading message
    const userMessageId = new Date().getTime();
    const botMessageId = userMessageId + 1;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userMessage, id: userMessageId },
      { type: "bot", text: loadingMessage, id: botMessageId },
    ]);

    setUserInput(""); // Clear the input field after sending a message

    // Fetch bot response
    const res = await runChat(userMessage);

    const response = formatMessage(res)

    // Update the loading message with the actual bot response
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === botMessageId ? { ...message, text: response } : message
      )
    );

    setIsLoading(false);
    // Send messages to the backend
    await sendUserMessage(userMessage);
    await sendBotMessage(response);
    fetchChats()
  };

  // Function to handle deletion of a message
  const handleDeleteMessage = async (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId)
    );
    try {
      await axios.delete(`${process.env.REACT_APP_CHAT_API}/${messageId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Function tohandle the editing message
  const handleEditMessage = (messageId, text) => {
    setEditMessageId(messageId);
    setEditInput(text);
  };

  const handleEditInputChange = (event) => {
    setEditInput(event.target.value);
  };

  const handleEditSubmit = async (event, messageId, sender) => {
    if (event.key === "Enter") {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, text: editInput } : message
        )
      );
      try {
        await axios.put(`${process.env.REACT_APP_CHAT_API}/${messageId}`, {
          new_content: editInput,
          sender: sender,
        });
        setEditMessageId(null);
        setEditInput("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="app">
      <div className="chatbot-container">
        <Header />
        <div className="chatbot-body" ref={chatBodyRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.type === "user" ? "user" : "bot"
                }`}
            >
              {editMessageId === message.id ? (
                <input
                  type="text"
                  value={editInput}
                  onChange={handleEditInputChange}
                  onKeyDown={(event) =>
                    handleEditSubmit(event, message.id, message.type)
                  }
                  autoFocus
                />
              ) : (
                <>
                  {message.type === "user" && (
                    <div className="icon-container">
                      <FaEdit
                        className="edit-icon user-icon"
                        onClick={() =>
                          handleEditMessage(message.id, message.text)
                        }
                      />
                      <FaTrashAlt
                        className="delete-icon user-icon"
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                    </div>
                  )}
                  <span className="message-text">{message.text}</span>
                  {message.type === "bot" && message.text !== "..." && (
                    <FaTrashAlt
                      className="delete-icon bot-icon"
                      onClick={() => handleDeleteMessage(message.id)}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <Footer
          userInput={userInput}
          handleUserInput={handleUserInput}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
