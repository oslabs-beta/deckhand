import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import account from '../assets/account.png';

export default function Deckhand() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return <div className="account">
    <span>{state.user.name}</span>
    <img src={account} alt="Account" />
  </div>
}