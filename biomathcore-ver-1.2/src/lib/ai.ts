// src/lib/ai.ts

/**
 * getAiResponseStream
 *
 * Sends a chat completion request to OpenAI with streaming enabled.
 * onChunk() callback receives text chunks as they arrive.
 */

export const getAiResponseStream = async (
  input: string,
  apiKey: string,
  onChunk: (chunk: string) => void,
) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        temperature: 0.7,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API call failed:", response.status, errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      throw new Error("Response body reader is not available.");
    }

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.substring(6);
          if (data.trim() === "[DONE]") {
            return; // Stream finished
          }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch (error) {
            console.error("Error parsing stream data:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching AI response stream:", error);
    throw error;
  }
};
