
import { GEMINI_API_KEY } from "@/config/apiConfig";

export const analyzeImageWithGemini = async (imageBase64: string): Promise<string> => {
  try {
    // Using the updated Gemini 2.0 Flash model and endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Analyze this image and describe what you see in detail:" },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64.split(',')[1]
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, errorData);
      throw new Error(`API error ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    // Check and extract text from response according to expected structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.log('Unexpected API response structure:', JSON.stringify(data, null, 2));
      return "I couldn't analyze this image due to an API response format issue.";
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};
