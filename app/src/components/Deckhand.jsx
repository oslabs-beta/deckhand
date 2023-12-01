import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import FloatLogo from "./FloatLogo";
import FloatTitle from "./FloatTitle";
import FloatAccount from "./FloatAccount";

export default function Deckhand() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return <div className="container">
    <FloatLogo />
    <FloatTitle />
    <FloatAccount />
    <div className="content-container">
      <div className="content">
        <h1>Cluster 1</h1>
        <div id="project-cards">
          <div className="new-card">
            <div>New<br />Pod</div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}