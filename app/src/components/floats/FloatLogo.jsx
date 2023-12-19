import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId } from "../../deckhandSlice";
import logo from "../../assets/logo.png";

export default function FloatLogo() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="float-logo" onClick={() => dispatch(setProjectId(null))}>
      <svg
        version="1.1"
        className="logo"
        baseProfile="tiny"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 500 500"
        style={{ width: "40px", height: "40px" }}
      >
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="#333"
          strokeWidth="40"
        />

        <circle
          cx="250"
          cy="250"
          r="60"
          fill="#333"
          stroke="none"
          strokeWidth="40"
        />

        <line
          x1="250"
          y1="0"
          x2="250"
          y2="500"
          stroke="#333"
          strokeWidth="40"
        />
        <line
          x1="0"
          y1="250"
          x2="500"
          y2="250"
          stroke="#333"
          strokeWidth="20"
        />
        <line
          x1="35.36"
          y1="35.36"
          x2="464.64"
          y2="464.64"
          stroke="#333"
          strokeWidth="20"
        />
        <line
          x1="464.64"
          y1="35.36"
          x2="35.36"
          y2="464.64"
          stroke="#333"
          strokeWidth="20"
        />
      </svg>
      <span>Deckhand</span>
    </div>
  );
}
