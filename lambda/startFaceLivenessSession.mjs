import { RekognitionStreamingClient, StartFaceLivenessSessionCommand } from "@aws-sdk/client-rekognitionstreaming"; // ES Modules import

const rekognition = new RekognitionStreamingClient();

export async function handler (event, context) {
    try {
      event = JSON.parse(event.body);
  const input = { // GetFaceLivenessSessionResultsRequest
    SessionId: event.SessionId, // required
    VideoWidth: event.VideoWidth,
    VideoHeight: event.VideoHeight,
    ChallengeVersions: "ChallengeVersion1",
    LivenessRequestStream: 
    (async function* () {
      yield {
        VideoEvent: {
          VideoChunk: Buffer.from(event.Chunk, 'base64')
        }
      };
    })(),
  };
  const command = new StartFaceLivenessSessionCommand(input);


    const response = await rekognition.send(command);
    console.log("response",response)
    return {
        statusCode: 200,
        body: {
          SessionId: response.SessionId
        }
      }
    
  } catch (error) {
    console.error("Error creating live session:", error);
    console.log("response", {error}.$response)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating live session",
        error: error.message
      })
    };
}
};