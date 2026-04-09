import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { aiQueue } from "../queues/aiQueue";
import { enhanceBatikPrompt } from "../services/ai.service";

export async function enhancePrompt(req: Request, res: Response) {
  const { promptText } = req.body;
  const enhancedPrompt = await enhanceBatikPrompt(promptText);
  res.json({ success: true, data: { enhancedPrompt } });
}

export async function generateDesign(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub || req.body.userId;
  const { promptText, enhancedPrompt, styleParams } = req.body;
  const design = await prisma.customDesign.create({
    data: {
      userId,
      promptText,
      enhancedPrompt,
      styleParams: styleParams || {},
      jobStatus: "waiting",
    },
  });
  const job = await aiQueue.add("generate-design", { designId: design.id, userId, enhancedPrompt, styleParams: styleParams || {} });
  await prisma.customDesign.update({ where: { id: design.id }, data: { jobId: job.id?.toString() } });
  res.status(202).json({ success: true, data: { jobId: job.id, designId: design.id, message: "Design generation queued" } });
}

export async function status(req: Request, res: Response) {
  const design = await prisma.customDesign.findFirst({ where: { jobId: req.params.jobId } });
  res.json({ success: true, data: { jobStatus: design?.jobStatus || "waiting", state: design?.jobStatus || "waiting", imageUrl: design?.imageUrl, designId: design?.id } });
}

export async function myDesigns(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const designs = await prisma.customDesign.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: designs });
}

export async function deleteDesign(req: Request, res: Response) {
  await prisma.customDesign.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { message: "Design deleted" } });
}

export async function updateDesignStatus(req: Request, res: Response) {
  const design = await prisma.customDesign.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ success: true, data: design });
}
