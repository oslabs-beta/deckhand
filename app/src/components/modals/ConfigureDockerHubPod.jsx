import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureDockerHubPod() {
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

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (state.modal === "ConfigureDockerHubPod") getImages();
  }, [state.modal]);

  const getImages = async () => {
    await fetch("/api/dockerHubImages")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => <option value={el}>{el}</option>);
        setImages(arr);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mergePod = {
      name: formData.get("name"),
      config: {
        image: formData.get("image"),
        version: formData.get("version"),
      },
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
      className={`modal ${
        state.modal === "ConfigureDockerHubPod" ? "show" : ""
      }`}
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
            Docker Hub Image:
            <input type="text" name="image" defaultValue="mongo" />
          </label>
          <label>
            TEST: Docker Hub Images (fetched):
            <select name="image-test">{images}</select>
          </label>
          <label>
            Version:
            <select name="version">
              <option defaultValue="latest">latest</option>
            </select>
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
