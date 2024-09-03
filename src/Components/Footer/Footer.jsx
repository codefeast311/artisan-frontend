import React from "react";
import "./Footer.css";
import Pratham from "../../assets/pratham.jpg";
import { IoSettingsOutline } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";

function Footer({ userInput, handleUserInput, handleSendMessage }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && userInput.trim() !== "") {
      handleSendMessage();
      // Clear the input field after sending the message
      event.target.value = "";
    }
  };

  return (
    <div className="chatbot-footer">
      <div className="input-wrapper">
        <img src={Pratham} alt="Error in loading..." />
        <input
          type="text"
          placeholder="Your question"
          onChange={handleUserInput}
          onKeyDown={handleKeyDown}
          className="footer-input"
          value={userInput} // Control the input field with userInput
        />
      </div>
      <div className="footer-container">
        <div className="context">
          <label htmlFor="context">Context</label>
          <select className="footer-select">
            <option>OnBoarding</option>
            <option>None</option>
          </select>
        </div>
        <div className="footer-icons">
          <IoSettingsOutline />
          <VscSend onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Footer;
