import {
  CreateCollectionCommand,
} from '@aws-sdk/client-rekognition';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
const rekognition = new RekognitionClient();

export async function handler (event, context) {
  const collectionId = "upti";


  try {
    const data = await rekognition.send(
      new CreateCollectionCommand({ CollectionId: collectionId }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Collection created successfully",
        collectionId: collectionId,
        data: data
      })
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating collection",
        error: error.message
      })
    };
  }
};