import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureGithubPod() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => dispatch(setModal(null));
  const project = state.projectId
    ? state.projects.find((p) => p.id === state.projectId)
    : null;
  const cluster = state.clusterId
    ? project.clusters.find((c) => c.id === state.clusterId)
    : null;
  const pod = state.podId
    ? cluster.pods.find((p) => p.id === state.podId)
    : null;

  const [userRepos, setUserRepos] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (state.modal === "ConfigureGithubPod") {
      getUserRepos();
    }
  }, [state.modal]);

  const getUserRepos = async () => {
    await fetch("/api/github/userRepos")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <option key={el.full_name} value={el.full_name}>
            {el.full_name}
          </option>
        ));
        setUserRepos(arr);
      });
  };

  const getBranches = async (repo) => {
    await fetch("/api/github/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <option key={el.name} value={el.name}>
            {el.name}
          </option>
        ));
        setBranches(arr);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mergePod = {
      config: true,
      name: formData.get("name"),
      githubRepo: formData.get("userRepo"),
      githubBranch: formData.get("branch"),
    };
    dispatch(
      configurePod({
        projectId: state.projectId,
        clusterId: state.clusterId,
        podId: state.podId,
        mergePod: mergePod,
      })
    );
    closeModal();
  };

  return (
    <div
      className={`modal ${state.modal === "ConfigureGithubPod" ? "show" : ""}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Pod</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" defaultValue={pod ? pod.name : ""} />
          </label>
          <label>
            Github User Repo:
            <select
              name="userRepo"
              onChange={(e) => getBranches(e.target.value)}
            >
              {userRepos}
            </select>
            {/* <input
              type="text"
              name="url"
              defaultValue="http://github.com/o-mirza/example-repo"
            /> */}
          </label>
          <label>
            Branch:
            <select name="branch">{branches}</select>
            {/* <input type="text" name="branch" defaultValue="main" /> */}
          </label>
          {/* <label>
            Branch:
            <select name="branch">
              <option defaultValue="main">main</option>
            </select>
          </label> */}
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
