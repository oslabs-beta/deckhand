---
sidebar_position: 5
---

# Variables

Variables represent both ConfigMaps and Secrets, which are resources used to store and manage non-confidential and confidential data, respectively. ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable, while Secrets provide a secure way to store sensitive information like passwords, OAuth tokens, and ssh keys. Both ConfigMaps and Secrets can be consumed by Pods or used as environmental variables, command-line arguments, or as configuration files in a volume.

Deckhand manages the creation and deployment of ConfigMaps for non-sensitive data and Secrets for sensitive data, ensuring that they are securely stored and appropriately accessible to the pods that need them. These are managed natively within Kubernetes, utilizing EKS’s integrated security features to maintain data integrity and confidentiality.

## Configuration

:::note
Variables must be connected to a Pod. To establish this connection, click and drag the top handle of the Variables element to the bottom handle of the parent Pod element.
:::

When you drag a Variables element onto the canvas in Deckhand, you are given the option of inputting key-value pairs for your environmental variables. When the "Secret" option is unchecked, that key-value pair will be processed as a ConfigMap upon deployment. When the "Secret" option is checked, that key-value pair will be encoded and processed as a Secret upon deployment.

### Load Envs

Deckhand can also deep scan the connected repository for references to environmental variables automatically, and prefill the keys on the Edit Variables screen for easy input.

Click the Load Envs button to begin this process. This feature is currently supported for the following languages:

- JavaScript
- TypeScript
- Python
- Ruby
- Java
- PHP
- C#