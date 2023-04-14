# <h1 id="top">Running Matchmaking Backend</h1>

This guide will help you set up, run, and build a Next.js app using the T3 stack. Follow the steps below to get started.

## 📋 Prerequisites

<hr>

## <img align="center" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original-wordmark.svg" alt="git" width="30" height="30"/> Git

Git is a free and open source distributed version control system designed to handle everything from small to very large
projects with speed and efficiency.

```
https://git-scm.com/downloads
```

## <img align="center" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="30" height="30"/> NodeJS

Node.js® is an open-source, cross-platform JavaScript runtime environment.

```
https://nodejs.org/en/download/
```

## <img align="center" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/yarn/yarn-original-wordmark.svg" alt="yarn" width="30" height="30"/> Yarn

Yarn is a package manager for your code. It allows you to use and share (e.g. JavaScript) code with other developers
from around the world. Yarn does this quickly, securely, and reliably so you don’t ever have to worry.

```
https://classic.yarnpkg.com/en/docs/install/
```

## <img align="center" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="30" height="30"/> Docker

Develop faster. Run anywhere.

```
https://www.docker.com/
```

## <img align="center" src="https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg"  alt="docker" width="30" height="30"/> Kubernetes (optional)

Kubernetes, also known as K8s, is an open-source system for automating deployment, scaling, and management of
containerized applications.

```
https://kubernetes.io/docs/tasks/tools/
```

## 🚀 Getting Started

<hr>

## 📦 Step 1: Install Dependencies

Install all the necessary dependencies for your project by running the following command:

```bash
yarn install
```

## 🚀 Step 2: Launch the Development Server

Start the development server by executing the following command:

```bash
yarn run dev
```

## 🌐 Step 3: Access the App in Your Browser

Open your browser and navigate to localhost:3000 to see your app in action.

## 🏗 Step 4: Build the App for Production 🐳

To create a production-ready build of your app, run the following command:

```bash
docker build -f Dockerfile.prod -t <your-image-name> .
```

## :sunglasses: Step 5: Launch the App for Production 🐳

To create a production-ready build of your app, run the following command:

```bash
docker run -p 3000:3000 -d <your-image-name>
```

## 📝 Deploy to kubernetes

<hr>

## :pencil2: Step 1 : Create the `env.yml` file inse k8s folder and fill it with content of the `env.yml.example` file

## :scroll: Step 2 : Create the configmap

```bash
kubectl -f k8s/env.yml create
```

## :minidisc: Step 3 : Create the database deployment

```bash
kubectl -f k8s/database.yml create
```

## :outbox_tray: Step 4 : Create the deployment

```bash
kubectl -f k8s/deployment.yml create
```

## :robot: Step 5 : Create the ingress

```bash
kubectl -f k8s/ingress.yml create
```

## :black_nib: Step 6 : If you are on linux modify your `/etc/hosts` file and add the following line

```bash
$(minikube ip) matchmaking-back.info
```

## :rocket: Step 6 : Access the app

```bash
http://matchmaking-back.info
```

[top](#top)