"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createThread } from "@/actions/feedback";

type Props = {
  onThreadCreated?: (id: number) => void;
};

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "FEATURES", label: "Features" },
  { value: "BUGS", label: "Bugs" },
  { value: "FEEDBACK", label: "Feedback" },
] as const;

export default function NewThreadModal({ onThreadCreated }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<"GENERAL" | "FEATURES" | "BUGS" | "FEEDBACK">("GENERAL");
  const [body, setBody] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  const resetForm = () => {
    setTitle("");
    setBody("");
    setCategory("GENERAL");
  };

  const submit = () =>
    startTransition(async () => {
      try {
        if (!title.trim() || !body.trim()) return;

        const created = await createThread({ title: title.trim(), body: body.trim(), category });

        setOpen(false);
        resetForm();

        if (created?.id) {
          onThreadCreated?.(created.id);
          router.push(`/feedback/${created.id}`);   // ⬅️ langsung ke detail
          return;
        }

        // Fallback: paksa refresh list dengan query param agar “routing key” berubah
        if (pathname === "/feedback") {
          router.push(`/feedback?refresh=${Date.now()}`);
        } else {
          router.refresh();
        }
      } catch (e: any) {
        alert(e?.message ?? "Gagal membuat thread");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isSignedIn ? (
        <DialogTrigger asChild>
          <Button className="h-10 bg-blue-600 hover:bg-blue-600/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        </DialogTrigger>
      ) : (
        <SignInButton mode="modal">
          <Button variant="outline" className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Sign in to Post
          </Button>
        </SignInButton>
      )}

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Thread Baru</DialogTitle>
          <DialogDescription>Bagikan ide, laporan bug, atau feedback kamu.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nt-title">Judul</Label>
            <Input
              id="nt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dark mode toggle di navbar"
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nt-body">Konten</Label>
            <Textarea
              id="nt-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tulis detail ide/bug/feedback kamu…"
              className="min-h-[140px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            onClick={submit}
            disabled={pending || !title.trim() || !body.trim()}
            className="bg-blue-600 hover:bg-blue-600/90 text-white"
          >
            {pending ? "Menyimpan…" : "Publikasikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
