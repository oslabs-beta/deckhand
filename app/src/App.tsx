import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setUser, setState, setAuthStatus } from "./deckhandSlice";
import { MotionConfig, AnimatePresence } from 'framer-motion';
import Login from "./components/Login";
import Home from "./components/Home";
import Project from "./components/Project";

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.deckhand);

  useEffect(() => {
    const fetchGithubUserData = async () => {
      try {
        const response = await fetch("/api/github/userData");
        if (response.status === 401) {
          dispatch(setAuthStatus(false));
          return;
        }
        const data = await response.json();
        dispatch(setUser(data));
        if (data.state) dispatch(setState(data.state));
        if (data.theme === "dark")
          document.body.classList.add("dark-mode");
        dispatch(setAuthStatus(true));
      } catch (err) {
        console.log("Error fetching Github user data: ", err);
        dispatch(setAuthStatus(false));
      }
    };

    fetchGithubUserData();
  }, [dispatch]);

  if (state.authStatus === null) {
    return <div></div>;
  }

  return (
    <MotionConfig reducedMotion='user'>
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={state.authStatus ? <Navigate replace to="/" /> : <Login />} />
          <Route path="/" element={state.authStatus ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/project/:projectId" element={state.authStatus ? <Project /> : <Navigate replace to="/login" />} />
        </Routes>
      </AnimatePresence>
      </Router>
    </MotionConfig>
  );
}
