import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
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
  const [imageTags, setImageTags] = useState([]);

  useEffect(() => {
    if (state.modal === "ConfigureDockerHubPod") {
      getImages();
      getImageTags("centos");
    }
  }, [state.modal]);

  const getImages = async () => {
    await fetch("/api/dockerHubImages")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ));
        setImages(arr);
      })
      .catch((error) => console.log(error));
  };

  const getImageTags = async (image) => {
    await fetch(`/api/dockerHubImageTags/${image}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = data.map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ));
        setImageTags(arr);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mergePod = {
      config: true,
      name: formData.get("image"),
      imageName: formData.get("image"),
      imageTag: formData.get("imageTag"),
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
            <input
              type="text"
              name="image"
              onChange={(e) => getImageTags(e.target.value)}
            />
          </label>
          {/* <label>
            Docker Hub Image:
            <select name="image" onChange={(e) => getImageTags(e.target.value)}>
              {images}
            </select>
          </label> */}
          <label>
            Version:
            <select name="imageTag">{imageTags}</select>
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
