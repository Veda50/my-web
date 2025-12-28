"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  MessageSquare,
  Eye,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  Search,
  Plus,
  X,
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
  createdAt: string;
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

const POPULAR_COUNT = 1;

export default function FeedbackClient({ initialThreads }: { initialThreads: ThreadItem[] }) {
  const router = useRouter();
  const { language } = useLanguage() as {
    language: "en" | "id";
    setLanguage?: (lang: "en" | "id") => void;
  };
  const { isSignedIn } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | ThreadItem["category"]>("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "popular">("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const catLabel = language === "en" ? categoryLabelEN : categoryLabelID;

  const popularIds = useMemo(() => {
    const sorted = [...initialThreads].sort((a, b) => {
      // Popular berdasarkan jumlah views (sesuai permintaan)
      if (b.views !== a.views) return b.views - a.views;
      if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return new Set(sorted.slice(0, POPULAR_COUNT).map((t) => t.id));
  }, [initialThreads]);

  const threads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = initialThreads.filter((t) => {
      const matchesQ = t.title.toLowerCase().includes(q) || t.excerpt.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
      return matchesQ && matchesCat;
    });

    // eslint-disable-next-line prefer-const
    let sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          // Popular berdasarkan views
          if (b.views !== a.views) return b.views - a.views;
          if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: // latest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const pinned = sorted.filter((t) => popularIds.has(t.id));
    const rest = sorted.filter((t) => !popularIds.has(t.id));
    return [...pinned, ...rest];
  }, [initialThreads, searchQuery, selectedCategory, sortBy, popularIds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        {/* Header dengan gradient modern */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl -z-10" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2 sm:mb-3">
            {language === "en" ? "Community Feedback" : "Forum Masukan"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Share ideas, report bugs, or give suggestions to improve this site."
              : "Bagikan ide, laporan bug, atau saran untuk meningkatkan situs ini."}
          </p>
        </div>

        {/* Search Bar - Modern dengan efek glass */}
        <div className="mb-4 sm:mb-6 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl border">
            <div className="flex items-center px-3">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mr-2" />
              <Input
                placeholder={
                  language === "en" ? "Search feedback…" : "Cari feedback…"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-12 text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-9 rounded-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === "en" ? "Filters" : "Filter"}
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${
                  showMobileFilters ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Active filters badge */}
            {(selectedCategory !== "all" || sortBy !== "latest") && (
              <Badge variant="secondary" className="rounded-lg">
                {selectedCategory !== "all" ? 1 : 0} +{" "}
                {sortBy !== "latest" ? 1 : 0}
              </Badge>
            )}
          </div>

                    <NewThreadModal
            redirectToDetail={false}
            onThreadCreated={() => router.refresh()}
          />

        </div>

        {/* Desktop Filter Controls */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-2 min-w-40"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="truncate">
                    {selectedCategory === "all"
                      ? language === "en"
                        ? "All Categories"
                        : "Semua Kategori"
                      : catLabel[selectedCategory]}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl min-w-[200px]">
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("all")}
                  className="rounded-lg cursor-pointer"
                >
                  {language === "en" ? "All Categories" : "Semua Kategori"}
                </DropdownMenuItem>
                {Object.keys(catLabel).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() =>
                      setSelectedCategory(key as ThreadItem["category"])
                    }
                    className="rounded-lg cursor-pointer"
                  >
                    {catLabel[key as ThreadItem["category"]]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-2 min-w-[140px]"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="truncate">
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
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem
                  onClick={() => setSortBy("latest")}
                  className="rounded-lg cursor-pointer"
                >
                  {language === "en" ? "Latest" : "Terbaru"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("oldest")}
                  className="rounded-lg cursor-pointer"
                >
                  {language === "en" ? "Oldest" : "Terlama"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("popular")}
                  className="rounded-lg cursor-pointer"
                >
                  {language === "en" ? "Popular" : "Terpopuler"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop New Thread Button */}
          <NewThreadModal
            redirectToDetail={false}
            onThreadCreated={() => router.refresh()}
          />
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="sm:hidden mb-4 animate-in slide-in-from-top duration-200">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === "en" ? "Category" : "Kategori"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-lg"
                  >
                    {language === "en" ? "All" : "Semua"}
                  </Button>
                  {Object.keys(catLabel).map((key) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setSelectedCategory(key as ThreadItem["category"])
                      }
                      className="rounded-lg"
                    >
                      {catLabel[key as ThreadItem["category"]]}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === "en" ? "Sort by" : "Urutkan"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sortBy === "latest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("latest")}
                    className="rounded-lg"
                  >
                    {language === "en" ? "Latest" : "Terbaru"}
                  </Button>
                  <Button
                    variant={sortBy === "oldest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("oldest")}
                    className="rounded-lg"
                  >
                    {language === "en" ? "Oldest" : "Terlama"}
                  </Button>
                  <Button
                    variant={sortBy === "popular" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("popular")}
                    className="rounded-lg"
                  >
                    {language === "en" ? "Popular" : "Terpopuler"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threads List - Card tetap sama */}
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
                          <AvatarImage
                            src={t.authorAvatar || "/placeholder.svg"}
                            alt={t.authorName}
                          />
                          <AvatarFallback className="text-xs">
                            {(t.authorName || "AN").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground truncate">
                          {t.authorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>
                            {t.repliesCount}{" "}
                            {language === "en" ? "replies" : "balasan"}
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

      {/* Modal untuk mobile (controlled) */}
    </div>
  );
}