import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, configureProject } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const project = state.modal.data;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      configureProject({
        projectId: project.projectId,
        name: formData.get("name"),
        provider: formData.get("provider"),
        region: formData.get("region"),
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
        <h2>Configure Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" defaultValue={project.name} />
          </label>
          <label>
            Provider:
            <select name="provider" defaultValue="aws">
              <option value="aws">Amazon Web Services (AWS)</option>
            </select>
          </label>
          <label>
            Region:
            <select name="region" defaultValue="us-east-1">
              <option value="us-east-1">US East (Virginia)</option>
              <option value="us-east-2">US East (Ohio)</option>
              <option value="us-west-1">US West (N. California)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="ap-south-1">Asia Pacific (Mumbai)</option>
              <option value="ap-northeast-3">Asia Pacific (Osaka)</option>
              <option value="ap-northeast-2">Asia Pacific (Seoul)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              <option value="ap-southeast-2">Asia Pacific (Sydney)</option>
              <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              <option value="ca-central-1">Canada (Central)</option>
              <option value="eu-central-1">Europe (Frankfurt)</option>
              <option value="eu-west-1">Europe (Ireland)</option>
              <option value="eu-west-2">Europe (London)</option>
              <option value="eu-west-3">Europe (Paris)</option>
              <option value="eu-north-1">Europe (Stockholm)</option>
              <option value="sa-east-1">South America (São Paulo)</option>
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
