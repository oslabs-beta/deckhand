import React, { useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, updateNode } from "../../deckhandSlice";

export default function () {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;

  const [show, setShow] = useState<boolean>(false);
  const [type, setType] = useState<string>("docker-hub");
  const [dockerHubImages, setDockerHubImages] = useState<ReactNode>([]);
  const [userRepos, setUserRepos] = useState<ReactNode>([]);
  const [publicRepos, setPublicRepos] = useState<ReactNode>([]);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (type === "my-github") getUserRepos();
  }, [type]);

  const getDockerHubImages = async (input: string) => {
    if (!input) return setDockerHubImages([]);
    setDockerHubImages(<span className="pod-source-text">Loading...</span>);
    await fetch(`/api/dockerHubImages/${input}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el: any) => (
          <div
            key={el.name}
            className="pod-source"
            onClick={() => handleClickDockerHub(el.name)}
          >
            <div className="pod-source-container">
              <span className="primary">
                <b>{el.name}</b>
              </span>
              <span className="pod-source-stars">
                {"☆ " + formatStars(el.stars)}
              </span>
            </div>
            <div className="pod-source-repo-desc">
              <span>{el.description}</span>
            </div>
          </div>
        ));
        setDockerHubImages(arr);
      });
  };

  const getUserRepos = async () => {
    setUserRepos(
      <div className="pod-source-text">Loading...</div>
    );
    await fetch("/api/github/userRepos")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el: any) => (
          <div
            key={el.name + "-" + el.owner.login}
            className="pod-source"
            onClick={() => handleClickGithub(el.full_name)}
          >
            <div className="pod-source-container">
              <span className="primary">
                <b>{el.name}</b> by {el.owner.login}
              </span>
              <span className="pod-source-stars">
                {"☆ " + formatStars(el.stargazers_count)}
              </span>
            </div>
            <div className="pod-source-repo-desc">
              <span>{el.description}</span>
            </div>
          </div>
        ));
        if (arr.length) setUserRepos(arr);
        else
          setUserRepos(
            <div className="pod-source-text">
              No repositories found.
            </div>
          );
      });
  };

  const getPublicRepos = async (input: string) => {
    if (!input) return setPublicRepos([]);
    setPublicRepos(<span className="pod-source-text">Loading...</span>);
    await fetch("/api/github/publicRepos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data.items.map((el: any) => (
          <div
            key={el.name + "-" + el.owner.login}
            className="pod-source"
            onClick={() => handleClickGithub(el.full_name)}
          >
            <div className="pod-source-container">
              <span className="primary">
                <b>{el.name}</b> by {el.owner.login}
              </span>
              <span className="pod-source-stars">
                {"☆ " + formatStars(el.stargazers_count)}
              </span>
            </div>
            <div className="pod-source-repo-desc">
              <span>{el.description}</span>
            </div>
          </div>
        ));
        setPublicRepos(arr);
      });
  };

  function formatStars(starCount: number) {
    if (starCount < 10 ** 3) return starCount;
    else if (starCount < 10 ** 6) return (starCount / 1000).toFixed(1) + "k";
    else return (starCount / 10 ** 9).toFixed(1) + "M";
  }

  const handleClickDockerHub = async (image: string) => {
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

  const handleClickGithub = async (repo: string) => {
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
            <select title="source" name="source" onChange={(e) => setType(e.target.value)}>
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
              <div className="modal-scroll">
                {dockerHubImages}
              </div>
            </>
          )}
          {type === "my-github" && (
            <>
              <label>Select Repository:</label>
              <div className="modal-scroll">
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
              <div className="modal-scroll">
                {publicRepos}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
