import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, setUser } from "../../deckhandSlice";

export default function () {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      setUser({
        awsAccessKey: formData.get("awsAccessKey"),
        awsSecretKey: formData.get("awsSecretKey"),
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
        <h2>🔒 Link AWS Account</h2>
        <p>See instructions <a rel="noopener" href="https://deckhand.dev/docs/Integrations/aws" target="_blank">here</a>. Keys are AES-256 encrypted.</p>
        <form onSubmit={handleSubmit}>
          <label>
            AWS Access Key:
            <input
              type="password"
              name="awsAccessKey"
              defaultValue={state.user.awsAccessKey}
            />
          </label>
          <label>
            AWS Secret Key:
            <input
              type="password"
              name="awsSecretKey"
              defaultValue={state.user.awsSecretKey}
            />
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
