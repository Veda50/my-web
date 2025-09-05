"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Reply as ReplyIcon,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import {
  createReply,
  deleteReply,
  deleteThread,
  editReply,
  editThread,
} from "@/actions/feedback";
import { timeAgo } from "@/lib/date";

type UIThread = {
  id: number;
  title: string;
  body: string;
  createdAt: string; // ISO
  authorName: string;
  authorAvatar: string | null;
  authorRole: "MEMBER" | "DEVELOPER" | "MODERATOR" | "ADMIN";
  repliesCount: number;
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  viewsCount: number;
};

type UIReply = {
  id: number;
  body: string;
  createdAt: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole: "MEMBER" | "DEVELOPER" | "MODERATOR" | "ADMIN";
  canEdit: boolean;
};

type Props = {
  initialThread: UIThread;
  initialReplies: UIReply[];
  canEditThread: boolean;
  canReply: boolean;
  threadId: number;
};

const roleLabel = {
  MEMBER: "Community Member",
  DEVELOPER: "Developer",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
} as const;

const categoryClass = {
  FEATURES: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  BUGS: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  GENERAL: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  FEEDBACK: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
} as const;

const categoryLabel = {
  FEATURES: "Features",
  BUGS: "Bugs",
  GENERAL: "General",
  FEEDBACK: "Feedback",
} as const;

// key harian untuk view counter
function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("/", "-");
}

// temp id unik untuk optimistic reply
function makeTempId() {
  // id negatif + random agar tidak pernah bentrok
  const rnd =
    (typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint32Array(1))[0]
      : Math.floor(Math.random() * 1e9)) >>> 0;
  return -Number(`${Date.now()}${rnd.toString().slice(0, 3)}`);
}

export default function ThreadDetailClient({
  initialThread,
  initialReplies,
  canEditThread,
  canReply,
  threadId,
}: Props) {
  const { t } = useLanguage();
  const feedbackData = t("feedbackPage");
  const router = useRouter();
  const { user } = useUser();

  const [thread, setThread] = useState<UIThread>(initialThread);
  const [replies, setReplies] = useState<UIReply[]>(initialReplies);
  const [replyContent, setReplyContent] = useState("");
  const [busy, setBusy] = useState(false);

  // dialog states
  const [editThreadOpen, setEditThreadOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(initialThread.title);
  const [editBody, setEditBody] = useState(initialThread.body);

  const [editReplyOpen, setEditReplyOpen] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyBody, setEditingReplyBody] = useState("");

  const [deleteThreadOpen, setDeleteThreadOpen] = useState(false);
  const [deleteReplyId, setDeleteReplyId] = useState<number | null>(null);

  const {language} = useLanguage();

  // view counter (client-only)
  useEffect(() => {
    const lk = `tv:${threadId}:${todayKey()}`;
    if (typeof window !== "undefined" && localStorage.getItem(lk)) return;
    (async () => {
      try {
        const res = await fetch(`/api/threads/${threadId}/view`, { method: "POST", cache: "no-store" });
        if (!res.ok) return;
        const json: { counted?: boolean; views?: number } = await res.json();
        if (typeof json.views === "number") setThread((p) => ({ ...p, viewsCount: json.views! }));
        else if (json.counted) setThread((p) => ({ ...p, viewsCount: p.viewsCount + 1 }));
        try {
          localStorage.setItem(lk, "1");
        } catch {}
      } catch {}
    })();
  }, [threadId]);

  // ===== Actions =====
  async function onSubmitReply() {
    if (!replyContent.trim()) return;
    setBusy(true);
    const bodyTrim = replyContent.trim();

    // optimistic append (gunakan temp id unik)
    const optimisticId = makeTempId();
    const optimistic: UIReply = {
      id: optimisticId,
      body: bodyTrim,
      createdAt: new Date().toISOString(),
      authorName: user?.firstName || (user as any)?.fullName || "You",
      authorAvatar: user?.imageUrl || null,
      authorRole: "MEMBER",
      canEdit: true,
    };
    setReplies((prev) => [...prev, optimistic]);
    setReplyContent("");

    try {
      const created = await createReply({ threadId, body: bodyTrim });
      if (created?.id) {
        // ganti temp id dengan id asli supaya tidak dobel key
        setReplies((prev) =>
          prev.map((r) => (r.id === optimisticId ? { ...r, id: created.id } : r)),
        );
      }
      router.refresh();
    } catch (e: any) {
      // rollback jika gagal
      setReplies((prev) => prev.filter((r) => r.id !== optimisticId));
      alert(e?.message ?? "Gagal mengirim balasan");
    } finally {
      setBusy(false);
    }
  }

  async function doEditThread() {
    setBusy(true);
    try {
      await editThread(threadId, { title: editTitle, body: editBody });
      setThread((p) => ({ ...p, title: editTitle, body: editBody }));
      setEditThreadOpen(false);
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "Gagal mengubah thread");
    } finally {
      setBusy(false);
    }
  }

  function openEditReply(id: number, current: string) {
    setEditingReplyId(id);
    setEditingReplyBody(current);
    setEditReplyOpen(true);
  }

  async function doEditReply() {
    if (editingReplyId == null) return;
    setBusy(true);
    try {
      await editReply(editingReplyId, { body: editingReplyBody });
      setReplies((prev) => prev.map((r) => (r.id === editingReplyId ? { ...r, body: editingReplyBody } : r)));
      setEditReplyOpen(false);
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "Gagal mengubah balasan");
    } finally {
      setBusy(false);
    }
  }

  async function doDeleteThread() {
    setBusy(true);
    try {
      await deleteThread(threadId, { hard: true });
      setDeleteThreadOpen(false);
      router.push("/feedback");
    } catch (e: any) {
      alert(e?.message ?? "Gagal menghapus thread");
    } finally {
      setBusy(false);
    }
  }

  async function doDeleteReply() {
    if (deleteReplyId == null) return;
    setBusy(true);
    try {
      await deleteReply(deleteReplyId);
      setReplies((prev) => prev.filter((r) => r.id !== deleteReplyId));
      setDeleteReplyId(null);
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "Gagal menghapus balasan");
    } finally {
      setBusy(false);
    }
  }

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${thread.title}`;
    if (navigator.share) navigator.share({ title: thread.title, text, url }).catch(() => {});
    else navigator.clipboard.writeText(url).then(() => alert("Link disalin ke clipboard"));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="animate-fade-in-up">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {feedbackData.threadDetail.backButton}
          </Button>
        </div>

        {/* Thread */}
        <Card className="mb-8 animate-fade-in-up animate-delay-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={categoryClass[thread.category]}>{categoryLabel[thread.category]}</Badge>
                </div>

                <h1 className="text-2xl font-bold text-card-foreground mb-3 break-words">{thread.title}</h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={thread.authorAvatar || "/placeholder.svg"} alt={thread.authorName} />
                      <AvatarFallback>{thread.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <div className="font-medium text-foreground truncate">{thread.authorName}</div>
                      <div className="text-xs">{roleLabel[thread.authorRole]}</div>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-8 hidden sm:block" />

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{replies.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{thread.viewsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span suppressHydrationWarning>{timeAgo(thread.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={busy}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={share}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {feedbackData.threadDetail.shareButton}
                  </DropdownMenuItem>
                  {canEditThread && (
                    <>
                      <DropdownMenuItem onClick={() => setEditThreadOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {feedbackData.threadDetail.editButton}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteThreadOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {feedbackData.threadDetail.deleteButton}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {thread.body
                .split(/\n+/)
                .map((p, i) => (
                  <p key={`tpara-${thread.id}-${i}`} className="mb-4 last:mb-0 break-words">
                    {p}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold animate-fade-in-up animate-delay-400">
            {replies.length} {feedbackData.threadStats.replies}
          </h2>

          {/* Form */}
          <Card className="animate-fade-in-up animate-delay-600">
            <CardContent className="pt-6">
              {canReply ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder={feedbackData.threadDetail.replyPlaceholder}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={onSubmitReply}
                      disabled={!replyContent.trim() || busy}
                      className="bg-blue-600 hover:bg-blue-600/90 text-white"
                    >
                      {busy ? "Posting..." : feedbackData.threadDetail.submitReply}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">{language === 'en' ? "You need to log in to write a reply." : "Kamu perlu masuk untuk menulis balasan."}</div>
              )}
            </CardContent>
          </Card>

          {/* List */}
          {replies.map((reply, index) => (
            <Card
              key={`reply-${reply.id}-${reply.createdAt}`} // ✔️ key unik & stabil
              className="animate-fade-in-up"
              style={{ animationDelay: `${800 + index * 80}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.authorName} />
                    <AvatarFallback>{reply.authorName?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-medium text-foreground">{reply.authorName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {roleLabel[reply.authorRole]}
                      </Badge>
                      <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                        {timeAgo(reply.createdAt)}
                      </span>
                    </div>

                    <p className="text-card-foreground mb-4 break-words">{reply.body}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="ghost" size="sm">
                        <ReplyIcon className="h-4 w-4 mr-2" />
                        {feedbackData.threadDetail.replyButton}
                      </Button>

                      {reply.canEdit && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => openEditReply(reply.id, reply.body)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {feedbackData.threadDetail.editButton}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteReplyId(reply.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {feedbackData.threadDetail.deleteButton}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialogs / Alerts */}
      <Dialog open={editThreadOpen} onOpenChange={setEditThreadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thread</DialogTitle>
            <DialogDescription>Perbarui judul dan konten thread.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Judul" />
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Konten"
              className="min-h-[140px]"
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              onClick={doEditThread}
              disabled={busy || !editTitle.trim() || !editBody.trim()}
              className="bg-blue-600 hover:bg-blue-600/90 text-white"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editReplyOpen} onOpenChange={setEditReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Balasan</DialogTitle>
            <DialogDescription>Ubah isi balasan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={editingReplyBody}
              onChange={(e) => setEditingReplyBody(e.target.value)}
              placeholder="Balasan"
              className="min-h-[140px]"
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              onClick={doEditReply}
              disabled={busy || !editingReplyBody.trim()}
              className="bg-blue-600 hover:bg-blue-600/90 text-white"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteThreadOpen} onOpenChange={setDeleteThreadOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus thread?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus thread beserta semua balasannya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={doDeleteThread} className="bg-orange-500 hover:bg-orange-500/90 text-white">
              Ya, hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteReplyId != null} onOpenChange={(open) => !open && setDeleteReplyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus balasan?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doDeleteReply} className="bg-orange-500 hover:bg-orange-500/90 text-white">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
