import React from "react";
import { useSelector, useDispatch } from "react-redux";
import /* reducers */ "./deckhandSlice";
import Login from "./components/Login";
import Home from "./components/Home";
import Project from "./components/Project";

// if (localStorage.getItem('accessToken')) {
//   async function getUserData () {
//     await fetch('http://localhost:3000/getUserInfo', {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
//       }
//     }).then(response => response.json())
//     .then(info => {

//     const data = {
//       id: 1,
//       name: info.name,
//       email: info.email,
//       avatarUrl: info.avatar_url,
//       oauth: {
//         github: true,
//         google: false,
//         microsoft: false,
//       },
//       repos: {
//         github: true,
//       },
//       cloudProviders: {
//         aws: { accessKey: "xyz", secretKey: "xyz" },
//         gcp: null,
//         azure: null,
//       },
//     };
//       dispatch(setUser(data));
//     });



//     await fetch('http://localhost:3000/getUserData', {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
//         'scope': 'repo'
//       }
//     }).then(response => response.json())
//     .then(info => {
//       console.log(info);
//     })
//   };
//   getUserData();
// }


export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.deckhand);

  // attempts to fix the state issue:

  // !state.user
  // document.cookie.indexOf('code_token')
  // !localStorage.getItem('accessToken')

  if (!state.user) return <Login />;
  else if (!state.projectId) return <Home />;
  else return <Project />;
}
