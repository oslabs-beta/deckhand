import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import { setUser } from "../deckhandSlice";

export default function Projects() {
  const state = useSelector((state) => state.main);
  const dispatch = useDispatch();

  const handleClick = (e) => {

    e.preventDefault();

    localStorage.removeItem('accessToken');
    location.reload();

  };

  return <>
  <h1>Project list</h1>
  <button onClick={handleClick}>
    Log Out With GitHub
  </button>
  </>;
}