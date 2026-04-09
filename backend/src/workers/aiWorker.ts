import { Worker } from "bullmq";
import { prisma } from "../config/db";
import { redis, redisPublisher } from "../config/redis";
import { generateReplicateImage } from "../services/ai.service";
import { uploadDesignImage } from "../services/image.service";
import type { AIGenerationJob } from "../types";

const worker = new Worker<AIGenerationJob>(
  "ai-design-generation",
  async (job) => {
    await prisma.customDesign.update({ where: { id: job.data.designId }, data: { jobStatus: "active" } });
    const imageUrl = await generateReplicateImage(job.data.enhancedPrompt);
    const uploadedUrl = imageUrl.startsWith("http")
      ? await uploadDesignImage(imageUrl, job.data.designId)
      : imageUrl;

    await prisma.customDesign.update({
      where: { id: job.data.designId },
      data: { imageUrl: uploadedUrl, jobStatus: "completed" },
    });

    await redisPublisher.publish(
      "design-events",
      JSON.stringify({ event: "design:ready", userId: job.data.userId, designId: job.data.designId, imageUrl: uploadedUrl })
    );

    return { imageUrl: uploadedUrl };
  },
  { connection: redis, concurrency: 3 }
);

worker.on("failed", async (job, error) => {
  if (!job) return;
  await prisma.customDesign.update({ where: { id: job.data.designId }, data: { jobStatus: "failed" } }).catch(() => null);
  await redisPublisher.publish(
    "design-events",
    JSON.stringify({ event: "design:failed", userId: job.data.userId, designId: job.data.designId, error: error.message })
  );
});
