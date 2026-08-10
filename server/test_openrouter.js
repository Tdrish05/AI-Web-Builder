import "dotenv/config";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log("Using OpenRouter API Key:", apiKey);

  try {
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey || "",
    });

    const modelName = "openrouter/free";
    console.log(`Calling generateText with OpenRouter model: ${modelName}...`);
    const { text } = await generateText({
      model: openrouter(modelName),
      prompt: "Hello, reply with 'test success'",
    });
    console.log("Success! Response:", text);
  } catch (err) {
    console.error("OpenRouter Error:", err);
  }
}

main();
