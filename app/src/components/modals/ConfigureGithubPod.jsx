import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import AsyncSelect from "react-select/async";
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
  const [publicRepos, setPublicRepos] = useState([]);
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
            {el.name + " by " + el.owner.login}
          </option>
        ));
        setUserRepos(arr);
      });
  };

  const getPublicRepos = async (input) => {
    return fetch("/api/github/publicRepos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = data.items.map((el) => ({
          value: el.full_name,
          name: el.name,
          owner: el.owner.login,
          stars: el.stargazers_count,
          description: el.description,
        }));
        return arr;
      });
  };

  function formatStars(starCount) {
    if (starCount < 10 ** 3) return starCount;
    else if (starCount < 10 ** 6) return (starCount / 1000).toFixed(1) + "k";
    else return (starCount / 10 ** 9).toFixed(1) + "M";
  }

  const OptionComponent = ({ innerProps, data }) => (
    <div style={{ height: "100px" }}>
      <div
        {...innerProps}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "5 5 0 5",
        }}
      >
        <span style={{ color: "#333" }}>
          <b>{data.name}</b> by {data.owner}
        </span>
        <span>{"⭐ " + formatStars(data.stars)}</span>
      </div>
      <div
        {...innerProps}
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 5 20 5",
          fontSize: "14px",
        }}
      >
        <span>{data.description}</span>
      </div>
    </div>
  );

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
      name: formData.get("userRepo").split("/")[1],
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
            My Repos:
            <select
              name="userRepo"
              onChange={(e) => getBranches(e.target.value)}
            >
              {userRepos}
            </select>
          </label>
          <label>
            Public Repos:
            <AsyncSelect
              cacheOptions
              loadOptions={getPublicRepos}
              defaultOptions
              components={{ Option: OptionComponent }}
            />
          </label>
          <label>
            Branch:
            <select name="branch">{branches}</select>
          </label>
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
