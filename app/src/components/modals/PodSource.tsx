import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, updateNode } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    // @ts-expect-error TS(2345): Argument of type '""' is not assignable to paramet... Remove this comment to see the full error message
    setShow("");
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;

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

  const getDockerHubImages = async (input: any) => {
    if (!input) return setDockerHubImages([]);
    // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
    setDockerHubImages(<span style={{ color: "#ccc" }}>Loading...</span>);
    await fetch(`/api/dockerHubImages/${input}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el: any) => <div
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
            <span className="primary">
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
        </div>);
        setDockerHubImages(arr);
      });
  };

  const getUserRepos = async () => {
    setUserRepos(
      // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
      <div style={{ color: "#ccc", marginTop: "10px" }}>Loading...</div>
    );
    await fetch("/api/github/userRepos")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el: any) => <div
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
            <span className="primary">
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
        </div>);
        if (arr.length) setUserRepos(arr);
        else
          setUserRepos(
            // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
            <div className="tertiary" style={{ marginTop: "10px" }}>
              No repositories found.
            </div>
          );
      });
  };

  const getPublicRepos = async (input: any) => {
    if (!input) return setPublicRepos([]);
    // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
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
        const arr = data.items.map((el: any) => <div
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
            <span className="primary">
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
        </div>);
        setPublicRepos(arr);
      });
  };

  function formatStars(starCount: any) {
    if (starCount < 10 ** 3) return starCount;
    else if (starCount < 10 ** 6) return (starCount / 1000).toFixed(1) + "k";
    else return (starCount / 10 ** 9).toFixed(1) + "M";
  }

  const handleClickDockerHub = async (image: any) => {
    await fetch(`/api/dockerHubImageTags/${image}`)
      .then((res) => res.json())
      .then((imageTags) => {
        dispatch(
          updateNode({
            id,
            type: "docker",
            data: {
              ...data,
              name: image.split("/").pop(),
              imageName: image,
              imageTag: imageTags.includes("latest") ? "latest" : imageTags[0],
              imageTags,
            },
          })
        );
      })
      .catch((error) => console.log(error));

    closeModal();
  };

  const handleClickGithub = async (repo: any) => {
    await fetch("/api/github/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo }),
    })
      .then((res) => res.json())
      .then((githubBranches) => {
        dispatch(
          updateNode({
            id,
            type: "github",
            data: {
              ...data,
              name: repo.split("/").pop(),
              githubRepo: repo,
              githubBranch: githubBranches.includes("main")
                ? "main"
                : githubBranches[0],
              githubBranches,
              imageName: null,
              imageTag: null,
            },
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
                }}
              >
                {publicRepos}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
