import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId } from "../../deckhandSlice";
const logo = require("../../assets/logo.svg");

export default function FloatLogo() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="float-logo" onClick={() => dispatch(setProjectId(null))}>
      <img alt="logo" src={logo} height="36" />
      <span>Deckhand</span>
    </div>
  );
}
