import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import { setUser } from "../deckhandSlice";

import { searchedRepos } from "../deckhandSlice";

export default function Projects() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  // this displays all of the repos of the user

  const array_of_users_repos = [];
  const array_of_searched_repos = [];

  (function going_through_repos () {

    for (let i = 0; i < state.user_repos.length; i++) {
      array_of_users_repos.push(<><a href={state.user_repos[i]}>Repo Number {i + 1}</a><br /></>)
    }

  })();

  // function for searching repos
  function test_this (e) {

    e.preventDefault();

    async function searchRepos (e) {

  
      await fetch('http://localhost:3000/searchInfo', {
        method: 'GET',
        headers: {
          'search': document.getElementById('search').value
        }
      })
      .then(response => response.json())
      .then(data => {

        console.log('the data', data.items)
  
        const array_of_repos = [];
                  
        for (let i = 0; i < data.items.length; i++) {
          array_of_repos.push(data.items[i].html_url)
        }

        console.log('arrayyyyy', array_of_repos)
        
        dispatch(searchedRepos(array_of_repos))
  
      })
  
    };

  searchRepos();

  };

  if (state.searched_repos.length > 0) {
    (function displaySearchedRepos () {
      for (let i = 0; i < 5; i++) {
        array_of_searched_repos.push(<><a href={state.searched_repos[i]}>Searched Repo Number {i + 1}</a><br /></>)
      }
  })();
  }

  // function for logging out
  

  const handleClick = (e) => {

    e.preventDefault();

    localStorage.removeItem('accessToken');
    dispatch(setUser(null));
    location.reload();

  };

  return <>
  <h1>Project list</h1>
  <button onClick={handleClick}>
    Log Out With GitHub
  </button>
  <h3>My name is: {state.user}</h3>
  <img src={state.user_photo} width='100px' />
  <br /><br />
  {array_of_users_repos}
  <br />
  <form onSubmit={test_this}>
    <input placeholder='Search From GitHub' id='search' />
    <button>Submit</button>
  </form>
  {array_of_searched_repos}
  </>;
}
