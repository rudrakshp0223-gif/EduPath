export async function analyzeStudentData(formData: any, fileContent?: string, fileMimeType?: string) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData, fileContent, fileMimeType }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status} ${response.statusText}`;
      try {
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          errorMessage = json.error || errorMessage;
        } catch (e) {
          errorMessage = `${errorMessage} - ${text.substring(0, 150)}`;
        }
      } catch (e) {
        // ignore
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    console.error("Error calling backend API:", err);
    throw err;
  }
}
