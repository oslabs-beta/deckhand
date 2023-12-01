import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import logo from '../assets/logo.png';

export default function FloatLogo() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return <div className="logo">
    <img src={logo} alt="Deckhand" />
  </div>
}