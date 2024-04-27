---
sidebar_position: 1
---

# Building Pods

If running locally, make sure the dependencies listed in the [Contributing](https://deckhand.dev/contributing) section are installed and configured. Make sure Docker is also actively running. Building repos and scanning ports uses the local Docker Daemon to execute docker commands.

Make sure Github repositories contain a Dockerfile. This is required for containerization and for autodetection of exposed ports during deployment.
