import { Queue } from "bullmq";
import { redis } from "../config/redis";
import type { AIGenerationJob } from "../types";

export const aiQueue = new Queue<AIGenerationJob>("ai-design-generation", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});
