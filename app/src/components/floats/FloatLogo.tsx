import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setProjectId } from "../../deckhandSlice";
const logo = require("../../assets/logo.svg");

export default function FloatLogo() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="float-logo" onClick={() => {
      dispatch(setProjectId(null))
      navigate('/');
    }}>
      <img alt="logo" src={logo} height="40" />
      <span>Deckhand</span>
    </div>
  );
}
