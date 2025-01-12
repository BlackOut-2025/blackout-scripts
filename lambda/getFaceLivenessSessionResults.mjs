import { RekognitionClient, GetFaceLivenessSessionResultsCommand, SearchFacesByImageCommand, IndexFacesCommand } from "@aws-sdk/client-rekognition"; // ES Modules import
import crypto from 'crypto';

const rekognition = new RekognitionClient();

export async function handler (event, context) {
  console.log(event);
  event = JSON.parse(event.body);
  const input = { // GetFaceLivenessSessionResultsRequest
    SessionId: event.SessionId, // required
  };

  const command = new GetFaceLivenessSessionResultsCommand(input);

  try {
    const response = await rekognition.send(command);
    if(response.Status == "EXPIRED" || response.Status == "CREATED") {
      return {
        statusCode: 200,
        body: "EXPIRED"
      }
    }

    if(response.Status != "SUCCEEDED" || response.Confidence < 0.8) {
      return {
        statusCode: 200,
        body: "AGAIN"
      }
    }

    const S3Object = response.ReferenceImage.S3Object;
    const searchCommand = new SearchFacesByImageCommand({
      "CollectionId": "upti",
      "Image": { 
         "S3Object": S3Object
      },
      "MaxFaces": 1
   })
   let faceId;
   try {
      const searchResponse = await rekognition.send(searchCommand);
      faceId = searchResponse.FaceMatches[0].Face.FaceId;
      
   } catch(err) {
      const indexFaceCommand = new IndexFacesCommand({
        CollectionId: "upti",
        "Image": { 
          "S3Object": S3Object
       },
       "MaxFaces": 1
      })
      const indexResponse = await rekognition.send(indexFaceCommand);
      faceId = searchResponse.FaceMatches[0].Face.FaceId;
   }

    const key = crypto.createHash('sha512').update(faceId.toString());
    return {
      statusCode: 200,
      body: key
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