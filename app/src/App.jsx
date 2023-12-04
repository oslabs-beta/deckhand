import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { setUser } from "./deckhandSlice";
import Login from "./components/Login";
import Projects from "./components/Projects";
import Deckhand from "./components/Deckhand";

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.deckhand);

  console.log('state', state.user);

  // Access local storage to get token 
  // if local storage doesnt have a token, render Login comoponent 

  // If local stroage does have a token, fetch from github the user, then add it to the state right here.

  if (!state.user) return <Login />
  else if (!state.project) return <Projects />;
  else return <Deckhand />;
}
