import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-distill-llama-70b",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
