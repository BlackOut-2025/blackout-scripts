import { RekognitionClient, CreateFaceLivenessSessionCommand } from "@aws-sdk/client-rekognition"; // ES Modules import

const rekognition = new RekognitionClient();

const input = {
  Settings: {
    OutputConfig: {
      S3Bucket: "blackout-16-bucket", // required
      S3KeyPrefix: "session-",
    },
    AuditImagesLimit: 1
  }
};
const command = new CreateFaceLivenessSessionCommand(input);


export async function handler (event, context) {



  try {
    const response = await rekognition.send(command);
    return {
      statusCode: 200,
      body: { SessionId: response.SessionId }
    };
  } catch (error) {
    console.error("Error creating live session:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating live session",
        error: error.message
      })
    };
  }
};