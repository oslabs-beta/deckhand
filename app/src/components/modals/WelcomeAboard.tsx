import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showModal, updateNode } from '../../deckhandSlice';
import Icon from "@mdi/react";
import {
  mdiDotsHexagon,
  mdiCircle,
  mdiKeyVariant,
  mdiImport,
  mdiDatabase,
} from "@mdi/js";
const logo = require("../../assets/logo.svg");

const Modal: React.FC = () => {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setShow(true);
  }, []);

  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };

    const pages = [
    <div key="p0">
      <h1 className="header"><img className="header-icon"  alt="logo" src={logo} height="40" />Welcome Aboard</h1>
      <p>Ahoy! And welcome to the exciting world of Kubernetes. I'm your Deckhand. I'll help you deploy a Kubernetes cluster with no code. Fully automated. Open source.</p>
      <p><b>Click Next to begin.</b></p>
    </div>,
    <div key="p1">
      <h1 className="header"><Icon className="header-icon" path={mdiDotsHexagon} style={{ color: "red" }} size={2} />Cluster Element</h1>
      <p>When you create a new project, you will be presented with an empty canvas. The ocean is yours, and the winds are favorable.</p>
      <p>Drag a <b>Cluster</b> element on the screen and select the resources (instance type and number of nodes) you’d like to provide for your application.</p>
      <p>Want to scale vertically? Select a more powerful instance type. Want to scale horizontally? Increase the number of nodes.</p>
    </div>,
    <div key="p2">
      <h1 className="header"><Icon className="header-icon"  path={mdiCircle} style={{ color: "#0db7ed" }} size={2} />Pod Element</h1>
      <p>Next, drag over a <b>Pod</b> element and connect it to your cluster. Here, you can choose between pulling in a Docker image or a GitHub repository.</p>
      <p>With your connected <b>GitHub</b> account, you can even pull in your private repositories. Deckhand automatically builds and stores your containerized application image. Do this for each of the microservices in your application.</p>
      <p>Do some parts of your application require particularly high availability and reliability? Simply adjust the number of <b>replicas</b> using the up and down arrows on the pod.</p>
    </div>,
      <div key="p3">
      <h1>Additional Elements</h1>
      <h3 className="header"><Icon className="header-icon"  path={mdiKeyVariant} style={{ color: "orange" }} size={1.25} />Ingress Element</h3>
      <p>Drag over an <b>Ingress</b> element and connect it to a pod to define the entry point to your application. Deckhand will automatically scan the connected pod to find the correct ports upon deployment.</p>
      <h3 className="header"><Icon className="header-icon"  path={mdiImport} style={{ color: "green" }} size={1.25} />Variables Element</h3>
      <p>Have any environmental variables? Drag over a <b>Variables</b> element, connect it to the relevant pods, and Deckhand will scan the repository for the required variables. Simply enter those values where prompted, and Deckhand will encode and configure the ConfigMap and Secrets upon deployment.</p>
      <h3 className="header"><Icon className="header-icon"  path={mdiDatabase} style={{ color: "violet" }} size={1.25} />Volume Element</h3>
      <p>Need persistent storage? Drag over a <b>Volume</b> element, connect it to a pod, and enter the mount path. Deckhand will provision the necessary persistent volume claims, storage classes, and volumes upon deployment.</p>
    </div>,
    <div key="p4">
      <h1 className="header"><img className="header-icon"  alt="logo" src={logo} height="40" />Deployment</h1>
      <p>When you’re ready, click <b>Deploy</b>. Deckhand will update with the URL for your running, load-balanced application.</p>
      <p><b>That's it! Now let's get started.</b></p>
    </div>
  ];

  const renderDots = () => {
    return (
      <div className="progress-dots">
        {[...Array(pages.length)].map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(idx)}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>&times;</span>
        {pages[currentPage]}
        {renderDots()}
        <div className="buttons">
          {currentPage === 0 && (
            <button type="button" onClick={closeModal}>
              Close
            </button>
          )}
          {currentPage > 0 && (
            <button type="button" onClick={() => setCurrentPage(currentPage - 1)}>
              Back
            </button>
          )}
          {currentPage < pages.length - 1 ? (
            <button type="button" onClick={() => setCurrentPage(currentPage + 1)} className="blue">
              Next
            </button>
          ) : (
            <button type="button" onClick={closeModal} className="blue">
              Let's go!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
