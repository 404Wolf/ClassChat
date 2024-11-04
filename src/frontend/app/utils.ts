export function blobArrayToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;
      resolve(base64Data.split(",")[1]);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
