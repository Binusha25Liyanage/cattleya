"use client";

import { FileText, ImageIcon, Download, Check, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  showTimestamp?: boolean;
  status?: "sent" | "read" | "failed";
  onRetry?: () => void;
  onImageClick?: (url: string) => void;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
  senderName,
  showTimestamp = true,
  status,
  onRetry,
  onImageClick,
}: MessageBubbleProps) {
  const bubbleClasses = isOwn
    ? "ml-auto max-w-[78%] rounded-[16px_16px_4px_16px] bg-[#D0021B] text-white"
    : "mr-auto flex max-w-[78%] rounded-[16px_16px_16px_4px] bg-white text-[#1A1A1A]";
  const timestamp = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  return (
    <div className={`mb-3 flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0021B] bg-white text-sm font-semibold text-[#1A1A1A]">
          C
        </div>
      ) : (
        <div className="w-9" />
      )}
      <div className="flex flex-col gap-1">
        {!isOwn && senderName ? <div className="text-[12px] font-medium text-[#6B6B6B]">{senderName}</div> : null}
        <div className={`${bubbleClasses} p-3 shadow-sm`}> 
          {message.messageType === "TEXT" && <div className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</div>}
          {message.messageType === "IMAGE" && message.fileUrl ? (
            <button type="button" onClick={() => onImageClick?.(message.fileUrl!)} className="group block rounded-2xl overflow-hidden bg-[#F5F5F5]">
              <img src={message.fileUrl} alt={message.fileName || "image"} className="h-auto w-full object-cover" />
              <div className="mt-2 flex items-center justify-between px-2 pb-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full bg-[#D0021B] px-2 py-1">View image</span>
                <Download className="h-4 w-4" />
              </div>
            </button>
          ) : null}
          {message.messageType === "FILE" && message.fileUrl ? (
            <div className="flex items-center gap-3 rounded-2xl bg-[#F5F5F5] p-3 text-sm text-[#1A1A1A]">
              <FileText className="h-5 w-5 text-[#D0021B]" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{message.fileName}</div>
                <div className="text-xs text-[#6B6B6B]">{message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : "Attachment"}</div>
              </div>
              <a href={message.fileUrl} target="_blank" rel="noreferrer" className="text-[#D0021B] hover:underline">
                Download
              </a>
            </div>
          ) : null}
        </div>
        {showTimestamp ? (
          <div className={`text-[11px] ${isOwn ? "text-[#F2F2F2]" : "text-[#6B6B6B]"} flex items-center gap-2`}>
            <span>{timestamp}</span>
            {status === "failed" ? <span className="text-[#FFD2D2]">Failed</span> : null}
            {status === "sent" ? <Check className="h-3.5 w-3.5" /> : null}
            {status === "read" ? <CheckCircle className="h-3.5 w-3.5 text-white" /> : null}
            {status === "failed" && onRetry ? (
              <button type="button" onClick={onRetry} className="text-[#FFD2D2] underline">
                Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
