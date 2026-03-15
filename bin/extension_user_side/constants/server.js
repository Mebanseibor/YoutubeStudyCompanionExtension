const serverIp = "localhost";
const serverPort = 5000;
export const serverAddress = `http://${serverIp}:${serverPort}`;
export const serverCardsEndpoint = `${serverAddress}/api/cards`;

export const createVideoIdBody = (videoId) => {
  return { videoId: videoId };
};
