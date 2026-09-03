"use client";

import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import type { TransferProof } from "@/lib/types";

export function TransferProofPreview({
  proof,
}: {
  proof: TransferProof | undefined;
}) {
  const t = useTranslations("Admin");

  if (!proof) {
    return (
      <p className="text-sm text-zinc-500">{t("noTransferProof")}</p>
    );
  }

  return (
    <div className="space-y-2 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 text-sm">
        <FileText className="size-4 shrink-0 text-zinc-500" />
        <span className="truncate font-medium text-zinc-800">
          {proof.fileName}
        </span>
      </div>
      {proof.fileType.startsWith("image/") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={proof.dataUrl}
          alt={t("transferProof")}
          className="max-h-72 w-full bg-white object-contain"
        />
      ) : (
        <a
          href={proof.dataUrl}
          download={proof.fileName}
          className="block px-3 py-4 text-sm font-medium text-amber-800 underline underline-offset-2"
        >
          {t("downloadProof")}
        </a>
      )}
    </div>
  );
}
