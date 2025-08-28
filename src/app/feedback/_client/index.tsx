"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  Clock,
  ChevronDown,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewThreadModal from "@/components/NewThreadModal";
import { timeAgo } from "@/lib/date";

type UIThread = {
  id: number;
  title: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole: "MEMBER" | "DEVELOPER" | "MODERATOR" | "ADMIN";
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  views: number;
  repliesCount: number;
  createdAt: string; // ISO
};

type Props = { initialThreads: UIThread[] };

const categoryLabel: Record<UIThread["category"], string> = {
  FEATURES: "Features",
  BUGS: "Bugs",
  GENERAL: "General",
  FEEDBACK: "Feedback",
};

const roleLabel: Record<UIThread["authorRole"], string> = {
  MEMBER: "Community Member",
  DEVELOPER: "Developer",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
};

const categoryClass: Record<UIThread["category"], string> = {
  FEATURES: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  BUGS:     "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  GENERAL:  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  FEEDBACK: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

// 🔝 jumlah item popular yang dipin (hardcode)
const POPULAR_LIMIT = 1;

export default function FeedbackClient({ initialThreads }: Props) {
  const { t } = useLanguage();
  const feedbackData = t("feedbackPage");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [threads] = useState<UIThread[]>(initialThreads);

  const handleThreadCreated = () => router.refresh();

  // Tentukan popular set (top N by replies, tiebreak by views, then newest)
  const popularIdSet = useMemo(() => {
    const arr = [...threads].sort((a, b) => {
      if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount;
      if (b.views !== a.views) return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return new Set(arr.slice(0, POPULAR_LIMIT).map((x) => x.id));
  }, [threads]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (th) =>
        th.title.toLowerCase().includes(q) ||
        th.authorName.toLowerCase().includes(q) ||
        categoryLabel[th.category].toLowerCase().includes(q),
    );
  }, [threads, searchQuery]);

  const sortedOthers = useMemo(() => {
    const others = filtered.filter((th) => !popularIdSet.has(th.id));
    if (sortBy === "oldest") {
      others.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      others.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return others;
  }, [filtered, sortBy, popularIdSet]);

  // Pinned selalu di atas, urutkan pinned by replies desc, lalu views, lalu newest
  const pinned = useMemo(() => {
    const pins = filtered.filter((th) => popularIdSet.has(th.id));
    pins.sort((a, b) => {
      if (b.repliesCount !== a.repliesCount) return b.repliesCount - a.repliesCount;
      if (b.views !== a.views) return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return pins;
  }, [filtered, popularIdSet]);

  // Final list: pinned + others (others mengikuti sort pilihan user)
  const finalList = useMemo(() => [...pinned, ...sortedOthers], [pinned, sortedOthers]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            {feedbackData.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {feedbackData.subtitle}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 animate-fade-in-up animate-delay-400">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={feedbackData.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[160px] bg-transparent h-10">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {sortBy === "latest" ? feedbackData.sortOptions.latest : feedbackData.sortOptions.oldest}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setSortBy("latest")}>
                  {feedbackData.sortOptions.latest}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  {feedbackData.sortOptions.oldest}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NewThreadModal onThreadCreated={handleThreadCreated} />
          </div>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          {finalList.length === 0 ? (
            <Card className="text-center py-12 animate-fade-in-up">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feedbackData.emptyState.title}</h3>
                <p className="text-muted-foreground mb-4">{feedbackData.emptyState.description}</p>
                <NewThreadModal onThreadCreated={handleThreadCreated} />
              </CardContent>
            </Card>
          ) : (
            finalList.map((th, idx) => {
              const isPopular = popularIdSet.has(th.id);
              return (
                <Card
                  key={th.id}
                  className="card-hover-lift cursor-pointer animate-fade-in-up transition-colors hover:border-primary/40"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Link href={`/feedback/${th.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryClass[th.category]}>{categoryLabel[th.category]}</Badge>
                            {isPopular && (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors line-clamp-2">
                            {th.title}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={th.authorAvatar || "/placeholder.svg"} alt={th.authorName} />
                            <AvatarFallback className="text-xs">
                              {th.authorName?.slice(0, 2).toUpperCase() || "US"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm text-muted-foreground truncate max-w-[160px] sm:max-w-none">
                              {th.authorName}
                            </div>
                            <div className="text-xs text-muted-foreground">{roleLabel[th.authorRole]}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{th.repliesCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{th.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span suppressHydrationWarning>{timeAgo(th.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
