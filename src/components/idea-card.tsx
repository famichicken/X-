"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GripVertical, Sparkles, Pencil, Trash2, Check, X } from "lucide-react";

interface IdeaCardProps {
  id: string;
  content: string;
  category: string;
  tags: string[];
  status: "new" | "draft" | "generated" | "posted";
  createdAt: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onGenerate?: (id: string) => void;
  isDragging?: boolean;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  new: { label: "新規", variant: "secondary" },
  draft: { label: "下書き", variant: "warning" },
  generated: { label: "生成済み", variant: "success" },
  posted: { label: "投稿済み", variant: "default" },
};

export function IdeaCard({
  id,
  content,
  category,
  tags,
  status,
  createdAt,
  onEdit,
  onDelete,
  onGenerate,
  isDragging = false,
}: IdeaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editContent.trim() && onEdit) {
      onEdit(id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const statusInfo = statusLabels[status] ?? statusLabels.new;
  const formattedDate = new Date(createdAt).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={cn(
        "group relative transition-shadow hover:shadow-md",
        isDragging && "shadow-lg ring-2 ring-neutral-300 dark:ring-neutral-600"
      )}
    >
      <CardContent className="flex gap-3 p-4">
        {/* Drag handle */}
        <div className="flex shrink-0 cursor-grab items-center text-neutral-400 active:cursor-grabbing dark:text-neutral-600">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Content / Edit area */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <Textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] resize-none text-sm"
                placeholder="アイデアを入力..."
              />
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Check className="mr-1 h-3 w-3" />
                  保存
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="mr-1 h-3 w-3" />
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-200">
              {content}
            </p>
          )}

          {/* Tags and metadata */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={statusInfo.variant} className="text-[10px]">
              {statusInfo.label}
            </Badge>
            {category && (
              <Badge variant="outline" className="text-[10px]">
                {category}
              </Badge>
            )}
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            <span className="ml-auto text-[10px] text-neutral-400 dark:text-neutral-500">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onGenerate && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onGenerate(id)}
              title="AI生成"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          )}
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
              title="編集"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-500 hover:text-red-600"
              onClick={() => onDelete(id)}
              title="削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
