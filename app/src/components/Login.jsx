import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../deckhandSlice";

import { setPhoto, userRepos, searchedRepos } from "../deckhandSlice";

import backgroundImage from '../assets/loginbackground.jpg';
import GitHub from "../GitHub_Login/GitHub";


export default function Login() {
  const state = useSelector((state) => state.deckhand);
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


        // Get the token in local storage to able to pass it down to GitHub later to get the repos and their public info.

        useEffect(() => {

            fetch('/grabCookie')
              .then(response => response.json())
              .then(data => {

              const codeParam = data;

              if (codeParam && localStorage.getItem('accessToken') === null) {
                async function getAccessToken () {
                  await fetch('http://localhost:3000/getAccessToken?code=' + codeParam)
                  .then(response => response.json())
                  .then(data => {
                    if (data.access_token) {
                      localStorage.setItem('accessToken', data.access_token);
                    }
                  })
                }
                getAccessToken();
              }

            });

        }, []);

      const handleClick = (event) => {
        //event.preventDefault();

        // GitHub Updates -- Odin

        // Making request for user to login to our app and to get access to their repos.

        function githubLogin () {

          console.log('inside github login')

          fetch('/getOauth', {mode: 'no-cors'})
            .then(res => res.json())
            .then(data => window.location.assign(data))
            .catch(err => console.log(err));
      
        };

        if (!localStorage.getItem('accessToken')) githubLogin();
        
        // Get the user's public data -- their profile pic, their name, their id.

        // For now, just the name


        async function getUserData () {

          // for user
            
            await fetch('http://localhost:3000/getUserInfo', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
              }).then(response => response.json())
              .then(data => {
                console.log('user', data);

                dispatch(setUser(data.name));
                dispatch(setPhoto(data.avatar_url));
              });

              // For repositories

              await fetch('http://localhost:3000/getUserData', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                  'scope': 'repo'
                }
              }).then(response => response.json())
              .then(data => {
                console.log('data', data)

                const array_of_repos = [];
                
                for (let i = 0; i < data.length; i++) {
                  array_of_repos.push(data[i].html_url)
                }

                dispatch(userRepos(array_of_repos));
              })

        };

        if (localStorage.getItem('accessToken')) getUserData();

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
                  {/* <GitHub /> */}
                </div>
            </div>
        </div>
  );
}