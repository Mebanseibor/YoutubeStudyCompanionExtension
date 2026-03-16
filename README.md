<div align="center">

# Capstone project

**AI-Powered YouTube Study Companion: A Chrome Extension for Structured**
**Educational Video Summarization**

<p><img src="./docs/assets/start.png" width="80%" /></p>
<p><img src="./docs/assets/progress.png" width="80%" /></p>
<p><img src="./docs/assets/result.png" width="80%" /></p>

</div>

---

## Vision

- Integrated into youtube's interface
- Real-time processing
- Packed as a chrome extension
- Flash cards
- Personalized experience
- Productivity tracker

---

## Building from scratch

### Requirements

- [Nodejs](https://nodejs.org/en)
- [Docker](https://www.docker.com/)

### Steps

- Clone this repository
- Building the extension pack:
  - In your terminal, navigate to the [extension folder](./bin/extension_user_side/) in the downloaded
    repository
  - Install dependencies: `npm install`
  - Build the application: `npm run build`
  - In your browser's extension tab, select the `dist` created by the
    build command

- Running the server:
  - In your terminal, navigate to the [server folder](./bin/server/)
  - Install dependencies: `npm install`
  - Running the mongodb server:
    - Set up the environment vaiables:
      ```bash
      PORT=yourPort
      MONGODB_USER=root
      MONGODB_PASSWORD=yourPassword
      MONGODB_URI=mongodb://root:yourPassword@localhost:27017
      ```
    - Run the docker compose command: `docker compose up`
  - Wait for the mongodb server to spin up
  - Run the server: `node server.js`

---

## Future Features

- AI-generated structured summary: Concise overview of video content
- Timestamp-based topic segmentation: Navigable links to key concepts
- Flashcard generation: For active recall and spaced repetition
- Auto-generated MCQs: To test comprehension immediately
- Productivity tracking: Estimation of time saved per video
