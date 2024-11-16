const PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
const AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';

export async function readFromBlobId(blobId: string) {
  try {
    console.log("Read from: " + blobId)
    // Make the API call to read from the blobId
    const response = await fetch(`${AGGREGATOR}/v1/${blobId}`, {
      method: 'GET',
    });

    // Check if the response is ok (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Failed to retrieve data: ${response.statusText}`);
    }

    // Assuming the response returns a blob or JSON content
    const result = await response.text(); // or response.text() depending on the content type
    console.log('Data from Blob:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function storeStringAndGetBlobId(data: string) {
  try {
    console.log("store walrus start: " + data.slice(0,100) + "...")
    // Make the API call to store the string
    const response = await fetch(`${PUBLISHER}/v1/store`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: data,
    });

    // Check if the response is ok (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Failed to store data: ${response.statusText}`);
    }

    // Parse the response to get the blob id
    const result = await response.json();
    console.log(result);
    
    let blobId: string | null = null;

    // Check for "alreadyCertified" or "newlyCreated" in the response and extract blobId
    if (result.alreadyCertified && result.alreadyCertified.blobId) {
      blobId = result.alreadyCertified.blobId;
    } else if (result.newlyCreated && result.newlyCreated.blobObject && result.newlyCreated.blobObject.blobId) {
      blobId = result.newlyCreated.blobObject.blobId;
    }

    if (blobId) {
      console.log('Blob ID:', blobId);
      return blobId;
    } else {
      throw new Error('Blob ID not found in response.');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}


export function base64ToFile(dataUrl: string, fileName: string): File {
  // Separate the metadata from the Base64 data
  const [metadata, base64Data] = dataUrl.split(",");
  // Extract the MIME type from the metadata
  const mimeType = metadata.match(/:(.*?);/)?.[1] || "application/octet-stream";

  // Decode the Base64 data
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Convert the byte array into a File
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: mimeType });
}