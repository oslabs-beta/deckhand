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
  const [dockerHubImages, setDockerHubImages] = useState([]);
  const [userRepos, setUserRepos] = useState([]);
  const [publicRepos, setPublicRepos] = useState([]);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (type === "my-github") getUserRepos();
  }, [type]);

  const getDockerHubImages = async (input) => {
    if (!input) return setDockerHubImages([]);
    setDockerHubImages(<span style={{ color: "#ccc" }}>Loading...</span>);
    await fetch(`/api/dockerHubImages/${input}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <div
            key={el.name}
            className="pod-source"
            onClick={() => handleClickDockerHub(el.name)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#333" }}>
                <b>{el.name}</b>
              </span>
              <span style={{ fontSize: "12px" }}>
                {"☆ " + formatStars(el.stars)}
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
        setDockerHubImages(arr);
      });
  };

  const getUserRepos = async () => {
    setUserRepos(
      <div style={{ color: "#ccc", marginTop: "10px" }}>Loading...</div>
    );
    await fetch("/api/github/userRepos")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <div
            key={el.name + "-" + el.owner.login}
            className="pod-source"
            onClick={() => handleClickGithub(el.full_name)}
          >
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
        if (arr.length) setUserRepos(arr);
        else
          setUserRepos(
            <div style={{ color: "#ccc", marginTop: "10px" }}>
              No repositories found.
            </div>
          );
      });
  };

  const getPublicRepos = async (input) => {
    if (!input) return setPublicRepos([]);
    setPublicRepos(<span style={{ color: "#ccc" }}>Loading...</span>);
    await fetch("/api/github/publicRepos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data.items.map((el) => (
          <div
            key={el.name + "-" + el.owner.login}
            className="pod-source"
            onClick={() => handleClickGithub(el.full_name)}
          >
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

  const handleClickDockerHub = async (image) => {
    dispatch(
      configurePod({
        podId: pod.podId,
        name: image,
        type: "docker-hub",
        imageName: image,
      })
    );

    await fetch(`/api/dockerHubImageTags/${image}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            podId: pod.podId,
            imageTag: data[0],
            imageTags: data,
          })
        );
      })
      .catch((error) => console.log(error));

    closeModal();
  };

  const handleClickGithub = async (repo) => {
    dispatch(
      configurePod({
        podId: pod.podId,
        name: repo.split("/")[1],
        type: "github",
        githubRepo: repo,
      })
    );

    await fetch("/api/github/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            podId: pod.podId,
            githubBranch: data[0],
            githubBranches: data,
          })
        );
      })
      .catch((err) => console.log(err));

    closeModal();
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Select Source</h2>
        <form>
          <label>
            <select name="source" onChange={(e) => setType(e.target.value)}>
              <option value="docker-hub">Docker Hub</option>
              <option value="my-github">My Github</option>
              <option value="public-github">Public Github</option>
            </select>
          </label>
          {type === "docker-hub" && (
            <>
              <label>
                Search Docker Hub:
                <input
                  type="text"
                  name="imageName"
                  onChange={(e) => getDockerHubImages(e.target.value)}
                />
              </label>
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  // maskImage:
                  //   "linear-gradient(to bottom, black calc(100% - 50px), transparent 100%)",
                }}
              >
                {dockerHubImages}
              </div>
            </>
          )}
          {type === "my-github" && (
            <>
              <label>Select Repository:</label>
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  // maskImage:
                  //   "linear-gradient(to bottom, black calc(100% - 50px), transparent 100%)",
                }}
              >
                {userRepos}
              </div>
            </>
          )}
          {type === "public-github" && (
            <>
              <label>
                Search Github:
                <input
                  type="text"
                  name="githubRepo"
                  onChange={(e) => getPublicRepos(e.target.value)}
                />
              </label>
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  // maskImage:
                  //   "linear-gradient(to bottom, black calc(100% - 50px), transparent 100%)",
                }}
              >
                {publicRepos}
              </div>
            </>
          )}
          {/* <div className="buttons">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="blue">
              Submit
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}
