"use client";

import { X, FileText, ImageIcon } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-[#E8E8E8] bg-[#F5F5F5] p-3 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#D0021B]">
        {isImage ? <ImageIcon className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="truncate font-medium text-[#1A1A1A]">{file.name}</div>
        <div className="text-[12px] text-[#6B6B6B]">{Math.round(file.size / 1024)} KB</div>
      </div>
      <button type="button" onClick={onRemove} className="text-[#6B6B6B] transition hover:text-[#D0021B]">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
