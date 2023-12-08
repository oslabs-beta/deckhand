import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureGithubPod() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => dispatch(setModal(null));

  const [repos, setRepos] = useState([]);
  const [reposInfo, setReposInfo] = useState([])
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    (async function grab_my_repos () {
      
      await fetch('/api/github/userRepos')
        .then(res => res.json())
        .then(information => {
          const inside_array = []
          console.log('information', information)

          for (let i = 0; i < information.length; i++) {
            inside_array.push(<>
            <option value={i}>{information[i].name}
            </option>
            </>);
          }

          setReposInfo(information);
          setRepos(inside_array);

        })
  
    })();
  }, []);

  const project = state.projectId
    ? state.projects.find((p) => p.id === state.projectId)
    : null;
  const cluster = state.clusterId
    ? project.clusters.find((c) => c.id === state.clusterId)
    : null;
  const pod = state.podId
    ? cluster.pods.find((p) => p.id === state.podId)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mergePod = {
      config: true,
      name: formData.get("name"),
      githubUrl: formData.get("url"),
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

  const grabBranches = async (e) => {
   const id = e.target.value;
   console.log("target:", e.target)
   console.log('reposInfo', reposInfo)
   console.log('id', id);
   const branchesUrlPre = reposInfo[id].branches_url;
   const branchesURL = branchesUrlPre.split('{')[0];

   const response = await fetch(branchesURL);
   const branchesContent = await response.json();

   const branchNames = [];

   for (let i = 0; i < branchesContent.length; i++) {
    branchNames.push(<option>{branchesContent[i].name}</option>)
   }

   setBranches(branchNames);


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
            Github Repo URL:
            <select onChange={grabBranches}>
              {repos}
            </select>
            {/* <input
              type="text"
              name="url"
              defaultValue="http://github.com/o-mirza/example-repo"
            /> */}
          </label>
          <label>
            Branch:
            <select>
              {branches}
            </select>
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