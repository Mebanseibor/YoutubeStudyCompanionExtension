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

### Without community server (Only local LLM)

#### Requirements

- [Nodejs](https://nodejs.org/en)
- [Ollama](https://ollama.com/)

#### Steps

- Clone this repository

<p id="building-the-extension-pack"></p>

- Build the extension pack
  - In your terminal, navigate to the [extension folder](./bin/extension_user_side/) in the downloaded
    repository
  - Install dependencies: `npm install`
  - Build the application: `npm run build`
  - In your browser's extension tab, select the `dist` created by the
    build command

> [!Tip]
> Set up a system variable for Ollama if the Ollama command is not available
> on your terminal

- Configure Ollama:
  - Download phi3.5:3.8b-mini-instruct-q4_K_M model:
    - `ollama pull phi3.5:3.8b-mini-instruct-q4_K_M`
  - Completely close Ollama
  - Open terminal
    - Enable Ollama to expect origin requests from the desired locations:
      - Powershell

        ```powershell
        $env:OLLAMA_ORIGINS="chrome-extension://*, http://localhost:*, https://www.youtube.com"
        ```

      - Command prompt

        ```cmd
        set OLLAMA_ORIGINS=chrome-extension://*,http://localhost:*,https://www.youtube.com
        ```

    - Serve Ollama (From the same terminal): `ollama serve`

### With community server

#### Requirements

- [Nodejs](https://nodejs.org/en)
- [Docker](https://www.docker.com/)
- [Google Cloud](https://console.cloud.google.com) API key:
  - With [YouTube Data API v3](https://console.cloud.google.com/apis/api/youtube.googleapis.com/) enabled

#### Steps

- Clone this repository
- Building the extension pack:
  - Refer to [this](#building-the-extension-pack)

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

      GOOGLE_CLOUD_API_KEY=yourGoogleCloudAPIKey
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
