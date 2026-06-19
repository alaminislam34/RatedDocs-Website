import { AlertTriangle, ArrowUpRight, FileText, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileRowProps {
  fileName: string;
  fileSize: string;
  href?: string;
}

export function FileRow({ fileName, fileSize, href }: FileRowProps) {
  const isVideo = fileName.endsWith(".mp4") || fileName.endsWith(".mov");

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isVideo ? "bg-amber-50" : "bg-red-50",
          )}
        >
          {isVideo ? (
            <Video className="h-4 w-4 text-amber-500" />
          ) : (
            <FileText className="h-4 w-4 text-red-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#1A1A2E]">
            {fileName}
          </p>
          <p className="text-xs text-gray-400">{fileSize}</p>
        </div>
      </div>
      <a
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        View <ArrowUpRight className="h-3 w-3" />
      </a>
    </div>
  );
}

export function MissingFileRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-medium text-amber-700">{label}</p>
        <p className="text-xs text-amber-500">{note}</p>
      </div>
    </div>
  );
}
