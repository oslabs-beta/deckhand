import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../deckhandSlice";
import LinkedCloudProviders from "../modals/LinkedCloudProviders";
import ConfigureProject from "../modals/ConfigureProject";
import ConfigureCluster from "../modals/ConfigureCluster";
import PodSource from "../modals/PodSource";
import ConfigurePodReplicas from "../modals/ConfigurePodReplicas";
import ConfigurePodIngress from "../modals/ConfigurePodIngress";
import ConfigurePodVolume from "../modals/ConfigurePodVolume";
import ConfigurePodVariables from "../modals/ConfigurePodVariables";
import ConfigurePodYaml from "../modals/ConfigurePodYaml";

export default function Modals() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <>
      {state.modal.name === "LinkedCloudProviders" && <LinkedCloudProviders />}
      {state.modal.name === "ConfigureProject" && <ConfigureProject />}
      {state.modal.name === "ConfigureCluster" && <ConfigureCluster />}
      {state.modal.name === "PodSource" && <PodSource />}
      {state.modal.name === "ConfigureGithubPod" && <ConfigureGithubPod />}
      {state.modal.name === "ConfigureDockerHubPod" && (
        <ConfigureDockerHubPod />
      )}
      {state.modal.name === "ConfigurePodReplicas" && <ConfigurePodReplicas />}
      {state.modal.name === "ConfigurePodIngress" && <ConfigurePodIngress />}
      {state.modal.name === "ConfigurePodVolume" && <ConfigurePodVolume />}
      {state.modal.name === "ConfigurePodVariables" && (
        <ConfigurePodVariables />
      )}
      {state.modal.name === "ConfigurePodYaml" && <ConfigurePodYaml />}
    </>
  );
}
