"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User, // dipakai juga sebagai ikon profil guest
  Briefcase,
  MessageSquare,
  Settings,
  Globe,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Code,
  FileText,
} from "lucide-react";
import { IoPricetagsOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { useRouter, usePathname } from "next/navigation";
import rawMenu from "@/data/menu.json";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

interface SubItem { title: string; route: string; sectionId?: string }
interface MenuItem { title: string; route: string; sectionId?: string; sub?: SubItem[] }
const menuData = rawMenu as MenuItem[];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSection: string;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();

  const getIconForMenuItem = (title: string) => {
    switch (title.toLowerCase()) {
      case "home": return Home;
      case "my work": return Briefcase;
      case "projects": return Code;
      case "studio": return Settings;
      case "blogs": return FileText;
      case "code snippets": return Code;
      case "feedback": return MessageSquare;
      case "about": return User;
      case "my experiences": return Calendar;
      case "my skills": return User;
      case "order": return IoPricetagsOutline;
      case "certification": return GrDocumentText;
      default: return Home;
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (!item?.route) return false;
    if (item.route === "/" || item.route.startsWith("#")) return pathname === "/";
    return pathname === item.route;
  };
  const isSubActive = (sub: SubItem) => {
    if (!sub?.route) return false;
    if (sub.route === "/" || sub.route.startsWith("#")) return pathname === "/";
    return pathname === sub.route;
  };
  const handleNavigation = (route: string) => {
    if (route === "/" || route.startsWith("#")) {
      router.push("/");
      setSidebarOpen(false);
      return;
    }
    router.push(route);
    setSidebarOpen(false);
  };

  // Stabil untuk SSR: tampilkan Guest sampai Clerk loaded + user login
  const signedIn = isLoaded && isSignedIn;

  const displayName = signedIn
    ? (user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "User")
    : "Guest";

  const displayInitials = signedIn
    ? (`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}` || "US")
    : "GT";

  const displayAvatar = signedIn
    ? (user?.imageUrl ?? "/placeholder.svg")
    : "/placeholder.svg";

  const statusText = signedIn ? "Signed in" : "Guest";

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20">
          {/* Account Section */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                {signedIn ? (
                  <>
                    <AvatarImage src={displayAvatar} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      {displayInitials}
                    </AvatarFallback>
                  </>
                ) : (
                  // Guest icon (profil orang)
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{displayName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{statusText}</p>
              </div>
            </div>

            {/* Actions */}
            {signedIn ? (
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs p-2 hover:bg-transparent cursor-not-allowed pointer-none:"
                  // onClick={() => handleNavigation("/settings")}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>

                <SignOutButton redirectUrl="/">
                  <button
                    className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-md"
                    title="Sign out"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </SignOutButton>
              </div>
            ) : (
              // Guest buttons: ghost + w-full + border blue + text blue
              <div className="flex flex-col gap-2">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                  >
                    Login
                  </Button>
                </SignInButton>

                {/* <SignUpButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    Daftar
                  </Button>
                </SignUpButton> */}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto" role="navigation" aria-label="Sidebar Navigation">
            <div className="space-y-1">
              {menuData.map((item, index) => {
                const Icon = getIconForMenuItem(item.title);
                const active = isItemActive(item);
                const subs = Array.isArray(item.sub) ? item.sub : [];

                return (
                  <div key={index}>
                    <button
                      onClick={() => handleNavigation(item.route)}
                      aria-current={active ? "page" : undefined}
                      data-active={active ? "true" : "false"}
                      className={`
                        group w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors relative
                        ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }
                      `}
                    >
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r ${
                          active ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                    </button>

                    {subs.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                        {subs.map((subItem, subIndex) => {
                          const SubIcon = getIconForMenuItem(subItem.title);
                          const subActive = isSubActive(subItem);

                          return (
                            <button
                              key={subIndex}
                              onClick={() => handleNavigation(subItem.route)}
                              aria-current={subActive ? "page" : undefined}
                              className={`
                                w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left transition-colors text-sm
                                ${
                                  subActive
                                    ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50/60 dark:bg-blue-900/20"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                                }
                              `}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  subActive ? "bg-blue-600 dark:bg-blue-400" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              />
                              <SubIcon className="w-3.5 h-3.5 opacity-70" />
                              <span>{subItem.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer controls */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs"
              >
                <Globe className="w-3 h-3 mr-2" />
                {language}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
