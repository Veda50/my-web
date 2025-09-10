"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { createThread } from "@/actions/feedback";

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

type Props = {
  onThreadCreated?: (id: number) => void;
  /** default: true => setelah create pindah ke detail; false => tetap di list & router.refresh() */
  redirectToDetail?: boolean;
};

type Category = "GENERAL" | "FEATURES" | "BUGS" | "FEEDBACK";

const translations = {
  en: {
    triggerNew: "New Thread",
    triggerSignin: "Sign in to Post",
    title: "Create New Thread",
    desc: "Share ideas, report bugs, or leave feedback.",
    labelTitle: "Title",
    placeholderTitle: "e.g. Add dark mode toggle in navbar",
    labelCategory: "Category",
    placeholderCategory: "Select a category",
    labelBody: "Content",
    placeholderBody: "Describe your idea/bug/feedback in detail…",
    cancel: "Cancel",
    publish: "Publish",
    saving: "Saving…",
    errCreate: "Failed to create thread",
    categories: {
      GENERAL: "General",
      FEATURES: "Features",
      BUGS: "Bugs",
      FEEDBACK: "Feedback",
    } as Record<Category, string>,
  },
  id: {
    triggerNew: "Thread Baru",
    triggerSignin: "Masuk untuk Post",
    title: "Buat Thread Baru",
    desc: "Bagikan ide, laporkan bug, atau beri masukan.",
    labelTitle: "Judul",
    placeholderTitle: "Contoh: Tambah toggle dark mode di navbar",
    labelCategory: "Kategori",
    placeholderCategory: "Pilih kategori",
    labelBody: "Konten",
    placeholderBody: "Tulis detail ide/bug/masukan kamu…",
    cancel: "Batal",
    publish: "Publikasikan",
    saving: "Menyimpan…",
    errCreate: "Gagal membuat thread",
    categories: {
      GENERAL: "Umum",
      FEATURES: "Fitur",
      BUGS: "Bug",
      FEEDBACK: "Masukan",
    } as Record<Category, string>,
  },
};

export default function NewThreadModal({ onThreadCreated, redirectToDetail = true }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const { language } = useLanguage() as { language: "en" | "id" };
  const t = translations[language];

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<Category>("GENERAL");
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
        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();
        if (!trimmedTitle || !trimmedBody) return;

        const created = await createThread({
          title: trimmedTitle,
          body: trimmedBody,
          category,
        });

        setOpen(false);
        resetForm();

        if (created?.id) {
          onThreadCreated?.(created.id);
          if (redirectToDetail) {
            router.push(`/feedback/${created.id}`);
          } else {
            // Tetap di list → baca ulang data SSR (server actions sudah invalidasi cache)
            router.refresh();
          }
          return;
        }

        // Fallback kalau id tidak ada
        if (pathname === "/feedback") {
          router.push(`/feedback?refresh=${Date.now()}`);
        } else {
          router.refresh();
        }
      } catch (e: any) {
        alert(e?.message ?? t.errCreate);
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isSignedIn ? (
        <DialogTrigger asChild>
          {/* Samakan ukuran dengan tombol filter: min-w-[140px] h-10 */}
          <Button className="min-w-[140px] h-10 px-4 bg-blue-600 hover:bg-orange-500/90 text-white rounded-md">
            <Plus className="h-4 w-4 mr-2" />
            {t.triggerNew}
          </Button>
        </DialogTrigger>
      ) : (
        <SignInButton mode="modal">
          <Button variant="outline" className="min-w-[140px] h-10 px-4">
            <Plus className="h-4 w-4 mr-2" />
            {t.triggerSignin}
          </Button>
        </SignInButton>
      )}

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.desc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nt-title">{t.labelTitle}</Label>
            <Input
              id="nt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.placeholderTitle}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.labelCategory}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue placeholder={t.placeholderCategory} />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(t.categories) as Category[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {t.categories[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nt-body">{t.labelBody}</Label>
            <Textarea
              id="nt-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t.placeholderBody}
              className="min-h-[140px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t.cancel}</Button>
          </DialogClose>
          <Button
            onClick={submit}
            disabled={pending || !title.trim() || !body.trim()}
            className="bg-blue-600 hover:bg-blue-600/90 text-white"
          >
            {pending ? t.saving : t.publish}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
