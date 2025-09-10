"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Eye,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  Search,
  Languages,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import NewThreadModal from "@/components/NewThreadModal";

type ThreadItem = {
  id: number;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole: "MEMBER" | "DEVELOPER" | "MODERATOR" | "ADMIN";
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  views: number;
  repliesCount: number;
  createdAt: string; // ISO
};

const categoryLabelEN: Record<ThreadItem["category"], string> = {
  FEATURES: "Feature Requests",
  BUGS: "Bug Reports",
  GENERAL: "General Discussion",
  FEEDBACK: "Feedback",
};

const categoryLabelID: Record<ThreadItem["category"], string> = {
  FEATURES: "Permintaan Fitur",
  BUGS: "Laporan Bug",
  GENERAL: "Diskusi Umum",
  FEEDBACK: "Masukan",
};

const categoryClass: Record<ThreadItem["category"], string> = {
  FEATURES: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  BUGS: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  GENERAL: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  FEEDBACK: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

function timeAgo(iso: string, lang: "en" | "id") {
  const date = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 36e5);
  if (diffH < 1) return lang === "en" ? "Just now" : "Baru saja";
  if (diffH < 24) {
    return lang === "en" ? `${diffH}h ago` : `${diffH}j lalu`;
  }
  const d = Math.floor(diffH / 24);
  if (d < 7) return lang === "en" ? `${d}d ago` : `${d} hari lalu`;
  return date.toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// berapa item yang dipin sebagai "Popular"
const POPULAR_COUNT = 1;

export default function FeedbackClient({ initialThreads }: { initialThreads: ThreadItem[] }) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage() as {
    language: "en" | "id";
    setLanguage?: (lang: "en" | "id") => void;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | ThreadItem["category"]>("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "popular">("latest");

  const catLabel = language === "en" ? categoryLabelEN : categoryLabelID;

  // Hitung popular sekali (berdasarkan data awal)
  const popularIds = useMemo(() => {
    const sorted = [...initialThreads].sort((a, b) => {
      if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount; // utama
      if (b.views !== a.views) return b.views - a.views; // tie-break
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // tie-break
    });
    return new Set(sorted.slice(0, POPULAR_COUNT).map((t) => t.id));
  }, [initialThreads]);

  // Filter + sort di client, lalu PASTIKAN popular dipin paling atas
  const threads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = initialThreads.filter((t) => {
      const matchesQ = t.title.toLowerCase().includes(q) || t.excerpt.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
      return matchesQ && matchesCat;
    });

    let sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount;
          if (b.views !== a.views) return b.views - a.views;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const pinned = sorted.filter((t) => popularIds.has(t.id));
    const rest = sorted.filter((t) => !popularIds.has(t.id));
    return [...pinned, ...rest];
  }, [initialThreads, searchQuery, selectedCategory, sortBy, popularIds]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">Feedback</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {language === "en"
              ? "Share ideas, report bugs, or give suggestions to improve this site."
              : "Bagikan ide, laporan bug, atau saran untuk meningkatkan situs ini."}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animate-delay-400">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={language === "en" ? "Search feedback…" : "Cari feedback…"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 items-center">
            {/* Category */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] h-10 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedCategory === "all"
                    ? language === "en"
                      ? "All"
                      : "Semua"
                    : catLabel[selectedCategory]}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                  {language === "en" ? "All" : "Semua"}
                </DropdownMenuItem>
                {Object.keys(catLabel).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSelectedCategory(key as ThreadItem["category"])}
                  >
                    {catLabel[key as ThreadItem["category"]]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] h-10 bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {sortBy === "latest"
                    ? language === "en"
                      ? "Latest"
                      : "Terbaru"
                    : sortBy === "oldest"
                    ? language === "en"
                      ? "Oldest"
                      : "Terlama"
                    : language === "en"
                    ? "Popular"
                    : "Terpopuler"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("latest")}>
                  {language === "en" ? "Latest" : "Terbaru"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  {language === "en" ? "Oldest" : "Terlama"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>
                  {language === "en" ? "Popular" : "Terpopuler"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[96px] h-10 bg-transparent">
                  <Languages className="h-4 w-4 mr-2" />
                  {language === "en" ? "EN" : "ID"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage?.("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage?.("id")}>Indonesia</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Submit Feedback (Modal) — stay on list & re-read */}
            <NewThreadModal
              redirectToDetail={false}
              onThreadCreated={() => router.refresh()}
            />

            {/* (Opsional) Fallback link */}
            {/*
            <Button asChild className="min-w-[140px] h-10">
              <Link href="/feedback/new" aria-label={language === "en" ? "Submit feedback" : "Kirim feedback"}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "Submit Feedback" : "Kirim Feedback"}
              </Link>
            </Button>
            */}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <Card className="text-center py-12 animate-fade-in-up">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en" ? "No threads yet" : "Belum ada thread"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "en"
                    ? "Be the first to leave a feedback."
                    : "Jadilah yang pertama memberi masukan."}
                </p>
              </CardContent>
            </Card>
          ) : (
            threads.map((t, i) => (
              <Card
                key={t.id}
                className="card-hover-lift cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Link href={`/feedback/${t.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryClass[t.category]}>
                            {catLabel[t.category]}
                          </Badge>

                          {/* Popular badge */}
                          {popularIds.has(t.id) && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {language === "en" ? "Popular" : "Populer"}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors break-words">
                          {t.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {t.excerpt}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={t.authorAvatar || "/placeholder.svg"} alt={t.authorName} />
                          <AvatarFallback className="text-xs">
                            {(t.authorName || "AN").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground truncate">{t.authorName}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>
                            {t.repliesCount} {language === "en" ? "replies" : "balasan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>
                            {t.views} {language === "en" ? "views" : "tayangan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span suppressHydrationWarning>
                            {timeAgo(t.createdAt, language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
