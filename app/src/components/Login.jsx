import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../deckhandSlice";
import logo from "../assets/logo.png";

export default function Login() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  // Put token in local storage (can be moved to db) that is needed to get GitHub repos and public info.
  useEffect(() => {

    if (localStorage.getItem('github_id')) {
      const data = {
        id: 1,
        name: 'Odin Olson',
        email: 'odinolsonsbooks@gmail.com',
        avatarUrl: 
        "https://avatars.githubusercontent.com/u/144394073?v=4",
        oauth: {
          github: true,
          google: false,
          microsoft: false,
        },
        repos: {
          github: true,
        },
        cloudProviders: {
          aws: { accessKey: "xyz", secretKey: "xyz" },
          gcp: null,
          azure: null,
        },
      };
        dispatch(setUser(data));
    }

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
              .catch(err => console.log(err));
          };
          getAccessToken();
        };
      });
  }, []);

  // this function sends the user to github for oauth. It never comes back to the .then since it is redirected in the backend.
  const handleClick = () => {
    function githubLogin () {
      fetch('/getOauth', {mode: 'no-cors'})
        .then(response => response.json())
        .then(data => window.location.assign(data))
        .catch(err => { console.log(err) });
    };

  // this function only runs if there is NOT an access token in local storage
  if (!localStorage.getItem('accessToken')) {
    githubLogin();
  };

  // this grabs the user's information
  async function getUserData () {
    await fetch('http://localhost:3000/getUserInfo', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    }).then(response => response.json())
    .then(info => {
      console.log(info);
      localStorage.setItem('github_id', info.id);
    // the object we are sending back to update the user
    const data = {
      id: 1,
      name: info.name,
      email: info.email,
      avatarUrl: info.avatar_url,
      oauth: {
        github: true,
        google: false,
        microsoft: false,
      },
      repos: {
        github: true,
      },
      cloudProviders: {
        aws: { accessKey: "xyz", secretKey: "xyz" },
        gcp: null,
        azure: null,
      },
    };
      dispatch(setUser(data));
    });

    // this function grabs the public and private repos of the user

    await fetch('http://localhost:3000/getUserData', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'scope': 'repo'
      }
    }).then(response => response.json())
    .then(info => {
      console.log(info);
    })
  };

  // doesn't run function unless there is an access token
  if (localStorage.getItem('accessToken')) {
    getUserData();
  };
  
  };

  return (
    <div id="login-container">
      <div className="image-section">
        <img src={logo} alt="Deckhand" />
      </div>
      <div className="login-section">
        <div className="button-container">
          <button id="github-button" onClick={handleClick}>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
