import React from "react";
import { RxCross2 } from "react-icons/rx";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";
import img from "../assets/a.jpg";
import "./Header.css";

function Header() {
  return (
    <div className="chatbot-header">
      <div className="top-wrapper">
        <TbArrowsDiagonalMinimize2 className="icons" />
        <RxCross2 className="icons" />
      </div>
      <div className="profile">
        <img src={img} alt="Error in loading..."/>
        <h2>Hey👋,I'm Ava</h2>
        <p>Ask me anything or pick a place to start</p>
      </div>
    </div>
  );
}

export default Header;
