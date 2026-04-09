import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function enhanceBatikPrompt(promptText: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return `${promptText}, traditional batik wax-resist dyeing texture, intricate hand-drawn line quality, fabric texture, rich color palette, repeating textile pattern, cultural motifs, elegant composition`;
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system:
      "You are a batik textile design expert. Transform the user's simple description into a rich, detailed image generation prompt specifically for batik fabric patterns. Include: traditional batik wax-resist dyeing texture, intricate hand-drawn line quality, fabric texture, color palette details, pattern repeat hints, and cultural motifs if relevant. Keep under 200 words.",
    messages: [{ role: "user", content: promptText }],
  });

  return response.content
    .map((part: { type: string; text?: string }) => (part.type === "text" ? part.text || "" : ""))
    .join(" ")
    .trim();
}

export async function generateReplicateImage(promptText: string) {
  const input = {
    prompt: `${promptText}, batik fabric pattern, wax resist dyeing, traditional textile, hand-drawn, intricate motifs, detailed`,
    negative_prompt: "photography, realistic photo, 3d render, digital art, modern design, plastic, blurry",
    width: 1024,
    height: 1024,
    num_inference_steps: 30,
  };

  if (!process.env.REPLICATE_API_TOKEN) {
    return `https://placehold.co/1024x1024/C9A84C/0A0A0A.png?text=${encodeURIComponent(promptText.slice(0, 24))}`;
  }

  const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version: "stability-ai/sdxl", input }),
  });

  const prediction = (await startResponse.json()) as { id: string };
  let current: { id: string; status: string; output?: string[] } = { id: prediction.id, status: "starting" };

  while (true) {
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    current = (await poll.json()) as { id: string; status: string; output?: string[] };
    if (current.status === "succeeded" && current.output?.[0]) {
      return current.output[0];
    }
    if (current.status === "failed" || current.status === "canceled") {
      throw new Error("Replicate generation failed");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
