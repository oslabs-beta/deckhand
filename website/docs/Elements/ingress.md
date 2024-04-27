---
sidebar_position: 4
---

# Ingress

An Ingress is a Kubernetes resource that manages external access to the services within a cluster, typically HTTP and HTTPS traffic. Ingress allows you to define routing rules that control external users' access to different services within your cluster based on the request URL. This is particularly useful for applications that require access from the Internet and simplifies the configuration of load balancing, SSL termination, and name-based virtual hosting.

Deckhand sets up AWS Load Balancers as part of the Ingress configuration to route external HTTP and HTTPS traffic to the appropriate services. This setup includes automated handling of SSL termination and DNS management, leveraging AWS’s robust networking capabilities.

## Configuration

:::note
Ingresses must be connected to a Pod. To establish this connection, click and drag the top handle of the Ingress element to the bottom handle of the parent Pod element.
:::

When you drag an Ingress element onto the canvas in Deckhand, you control how external traffic reaches your services. Initially, the button to 'Open Public URL' will be disabled. This feature becomes active only after the connected pod has been successfully deployed, allowing you to access your application directly through a public URL.

- **Port Specification:** By default, the Ingress is set to listen on port `80`. However, you have the option to specify a different port according to your application's requirements.
- **Automatic Port Detection:** During deployment, Deckhand intelligently scans the connected pod's Docker image to identify any ports exposed by the application. It then automatically configures the necessary Kubernetes resources to ensure that the Ingress routes traffic to the correct port.
- **Activation:** Once the deployment is complete, the 'Open Public URL' button will be enabled. Clicking this button provides direct access to your running application, which is now capable of handling load-balanced traffic across your cluster.