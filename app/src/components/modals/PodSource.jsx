import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, configurePod } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow("");
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const pod = state.modal.data;

  const [show, setShow] = useState(false);
  const [type, setType] = useState("docker-hub");
  const [userRepos, setUserRepos] = useState([]);
  const [publicRepos, setPublicRepos] = useState([]);

  useEffect(() => {
    setShow(true);
    getUserRepos();
  }, []);

  const getUserRepos = async () => {
    await fetch("/api/github/userRepos")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <option key={el.full_name} value={el.full_name}>
            {el.name + " by " + el.owner.login}
          </option>
        ));
        setUserRepos(arr);
      });
  };

  const getPublicRepos = async (input) => {
    setPublicRepos(<span style={{ color: "#ccc" }}>Loading...</span>);
    return fetch("/api/github/publicRepos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data.items.map((el) => (
          <div key={el.name} style={{ margin: "20 5", color: "#aaa" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#333" }}>
                <b>{el.name}</b> by {el.owner.login}
              </span>
              <span style={{ fontSize: "12px" }}>
                {"☆ " + formatStars(el.stargazers_count)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "14px",
              }}
            >
              <span>{el.description}</span>
            </div>
          </div>
        ));
        setPublicRepos(arr);
      });
  };

  function formatStars(starCount) {
    if (starCount < 10 ** 3) return starCount;
    else if (starCount < 10 ** 6) return (starCount / 1000).toFixed(1) + "k";
    else return (starCount / 10 ** 9).toFixed(1) + "M";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      configurePod({
        podId: pod.podId,
        config: true,
        type: type,
        githubRepo: formData.get("userRepo"),
      })
    );
    closeModal();
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Select Source</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <select name="userRepo" onChange={(e) => setType(e.target.value)}>
              <option value="docker-hub">Docker Hub</option>
              <option value="github">Github</option>
            </select>
          </label>
          {type === "github" && (
            <>
              <label>
                My Repos:
                <select name="userRepo">{userRepos}</select>
              </label>
              <label>
                Public Repos:
                <input
                  type="text"
                  name="search"
                  onChange={(e) => getPublicRepos(e.target.value)}
                />
              </label>
              <div style={{ maxHeight: "200px", overflow: "scroll" }}>
                {publicRepos}
              </div>
            </>
          )}
          <div className="buttons">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="blue">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
