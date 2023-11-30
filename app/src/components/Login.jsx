import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../deckhandSlice";
import backgroundImage from '../assets/loginbackground.jpg';

import GitHub from '../GitHub_Login/GitHub.js';

export default function Login() {
  const state = useSelector((state) => state.main);
  const dispatch = useDispatch();

      const containerStyle = {
        display: 'flex',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
    };

    const imageSectionStyle = {
        flex: 2,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '100%',
        paddingLeft: '20px'
    };

    const loginSectionStyle = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4'
    };

    const buttonContainer = {
        width: '80%',
        maxWidth: '300px',
        textAlign: 'center'
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#333',
        color: 'white',
        cursor: 'pointer'
    };

    const buttonHoverStyle = {
        backgroundColor: '#555'
    };
  
      const handleClick = (event) => {
        event.preventDefault();
        const user = {
            name: 'John', // get from Github
        };
        dispatch(setUser(user));
    };

  return (
      <div style={containerStyle}>
            <div style={imageSectionStyle}>
                <h1>Deckhand</h1>
            </div>
            <div style={loginSectionStyle}>
                <div style={buttonContainer}>
                  <button style={buttonStyle} onClick={handleClick}>
                    Sign in with GitHub
                  </button>
                  <GitHub />
                </div>
            </div>
        </div>
  );
}