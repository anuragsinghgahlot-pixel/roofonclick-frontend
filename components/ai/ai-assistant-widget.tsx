"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Trash2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Star,
  MapPin,
  Building,
  RotateCcw,
  Search,
  DollarSign,
  Compass,
  Calendar,
  PhoneCall,
  Home,
  CheckCircle2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MiniProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  image: string;
  isVerified?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  property?: MiniProperty;
  rawTime?: number;
}

const WELCOME_CHIPS = [
  { label: "Find PG", icon: Home, query: "Show me available PGs in Indore" },
  { label: "Budget ₹8000", icon: DollarSign, query: "Find PGs under ₹8,000" },
  { label: "Girls PG", icon: ShieldCheck, query: "Verified Girls PGs near me" },
  { label: "Boys Hostel", icon: Building, query: "Boys Hostels in Vijay Nagar" },
  { label: "AC Room", icon: Sparkles, query: "AC Rooms with 3-time Mess" },
  { label: "Near College", icon: MapPin, query: "Stays near DAVV College" },
  { label: "Verified Only", icon: CheckCircle2, query: "Show 100% verified properties" },
];

const QUICK_ACTIONS = [
  { label: "Search PG", icon: Search, prompt: "Search PGs in Indore" },
  { label: "Budget", icon: DollarSign, prompt: "What are the lowest rent options?" },
  { label: "Locations", icon: Compass, prompt: "Top areas for students in Indore" },
  { label: "Contact Owner", icon: PhoneCall, prompt: "How do I contact property owners?" },
  { label: "Book Visit", icon: Calendar, prompt: "Schedule a physical inspection visit" },
];

const EXCLUDED_ROUTES = [
  "/login",
  "/signup",
  "/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
  "/onboarding/role-selection",
  "/owner/dashboard",
  "/owner/properties",
  "/owner/property/new",
  "/settings",
];

const MOCK_RECOMMENDATION: MiniProperty = {
  id: "p1",
  name: "Elite Residency PG",
  location: "Vijay Nagar, Indore",
  price: 8500,
  rating: 4.8,
  type: "Hostel",
  image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  isVerified: true,
};

export function AIAssistantWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUpRef = React.useRef(false);

  // Excluded routes check
  const isExcluded = React.useMemo(() => {
    if (!pathname) return false;
    return EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));
  }, [pathname]);

  // Handle ESC key close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock document body scroll on mobile viewports when chat is open
  React.useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (window.innerWidth < 640) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  // Smart auto scroll: scroll to bottom ONLY if user hasn't scrolled up to read old messages
  React.useEffect(() => {
    if (isOpen && !userScrolledUpRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Scroll detection handler to determine if user manually scrolled up
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    userScrolledUpRef.current = !isAtBottom;
  };

  if (isExcluded) return null;

  const handleClearChat = () => {
    setMessages([]);
    userScrolledUpRef.current = false;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const now = Date.now();
    const userMsg: Message = {
      id: `u-${now}`,
      sender: "user",
      text: query,
      timestamp: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawTime: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);
    userScrolledUpRef.current = false;

    setTimeout(() => {
      let aiText = "I found verified listings matching your preferences in Indore! You can view them on our Search page or filter by area and amenities.";
      let propertyRec: MiniProperty | undefined = undefined;
      const lq = query.toLowerCase();

      if (lq.includes("8,000") || lq.includes("8000") || lq.includes("10,000") || lq.includes("10000") || lq.includes("budget") || lq.includes("find pg") || lq.includes("search pg")) {
        aiText = "Here is a top-rated verified PG in Vijay Nagar under your budget with AC, Wi-Fi, and 3-time meals included:";
        propertyRec = MOCK_RECOMMENDATION;
      } else if (lq.includes("girls") || lq.includes("female")) {
        aiText = "We have 28 verified Girls PGs with 24/7 Security, CCTV, Bio-metric locks, and female wardens in Vijay Nagar, Palasia & Geeta Bhawan.";
        propertyRec = {
          ...MOCK_RECOMMENDATION,
          id: "p2",
          name: "Skyline Girls Stays",
          location: "Bhawarkuan, Indore",
          price: 7200,
          type: "Girls PG",
        };
      } else if (lq.includes("boys") || lq.includes("male")) {
        aiText = "We have 35 top-rated Boys Hostels with Gym, High-speed Wi-Fi, and 3-time Mess meals near Coaching Hubs in Bhawarkuan & LIG Colony.";
      } else if (lq.includes("single") || lq.includes("double") || lq.includes("sharing")) {
        aiText = "Single, Double, and Triple occupancy rooms are available with attached washrooms, AC, and daily housekeeping.";
      }

      const aiNow = Date.now();
      const aiMsg: Message = {
        id: `ai-${aiNow}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date(aiNow).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        property: propertyRec,
        rawTime: aiNow,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* 3. FLOATING AI BUTTON */}
      <div
        className={cn(
          "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 select-none transition-all",
          pathname.startsWith("/admin") ? "z-[90] sm:bottom-8 sm:right-8" : "z-[950]"
        )}
      >
        <motion.button
          type="button"
          aria-label="Open RoofAI Assistant"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setHasUnread(false);
          }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_30px_rgba(26,59,43,0.3)] border border-primary/20 flex items-center justify-center cursor-pointer transition-all duration-300 group"
        >
          {/* Glass Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent pointer-events-none" />

          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-full bg-secondary/25 blur-md group-hover:bg-secondary/45 animate-pulse transition-all -z-10" />

          {/* AI Avatar Glyph Assembly */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary group-hover:text-secondary-foreground transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-secondary absolute -top-1 -right-1 animate-spin-slow" />
          </div>

          {/* Unread Badge */}
          {hasUnread && !isOpen && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-background animate-bounce" />
          )}
        </motion.button>
      </div>

      {/* CHAT WINDOW & PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[1000] w-full sm:w-[400px] md:w-[430px] max-h-[85vh] sm:max-h-[620px] h-[85vh] sm:h-[600px] bg-card border border-border/80 rounded-t-[28px] sm:rounded-[28px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* 8. HEADER (RoofAI / Your Property Concierge) */}
            <div className="px-5 py-4 bg-primary text-primary-foreground flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0">
                  <Bot className="w-5.5 h-5.5 text-secondary" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-sm font-extrabold tracking-tight">RoofAI</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/30">
                      Concierge
                    </span>
                  </div>
                  <span className="font-body text-[10px] text-primary-foreground/80 block mt-0.5">
                    Your Property Concierge
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-primary-foreground/80 hover:text-primary-foreground cursor-pointer"
                    aria-label="Clear Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-primary-foreground/80 hover:text-primary-foreground cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 1. SCROLLABLE CHAT MESSAGES BODY (Lenis-Prevented Mouse Wheel Scroll Area) */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              className="flex-1 p-4 overflow-y-auto space-y-4 text-left bg-muted/10 overscroll-contain"
            >
              {/* 11. EMPTY STATE / WELCOME CARD */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 py-2 text-left"
                >
                  <div className="bg-card border border-border/80 p-5 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-extrabold text-primary">Hi, I'm RoofAI 👋</h4>
                        <span className="font-body text-xs text-muted-foreground">What can I help you find today?</span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      Ask me any question about student hostels, PGs, monthly rent, or verified stays near your college or workplace in Indore.
                    </p>
                  </div>

                  {/* 4. WELCOME SUGGESTION CHIPS */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block px-1">
                      Quick Suggestions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {WELCOME_CHIPS.map((chip) => {
                        const Icon = chip.icon;
                        return (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => handleSendMessage(chip.query)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-body bg-card hover:bg-primary/10 hover:text-primary text-foreground border border-border/80 px-3 py-2 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 text-left"
                          >
                            <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>{chip.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. MESSAGES LIST */}
              {messages.map((msg, idx) => {
                const prevMsg = messages[idx - 1];
                const showTime =
                  !prevMsg ||
                  !msg.rawTime ||
                  !prevMsg.rawTime ||
                  msg.rawTime - prevMsg.rawTime > 5 * 60 * 1000;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "flex items-end gap-2 max-w-[90%]",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mb-4">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex flex-col space-y-2",
                        msg.sender === "user" ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl text-xs font-body leading-relaxed shadow-xs",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-xs font-medium"
                            : "bg-card border border-border/80 text-foreground rounded-bl-xs"
                        )}
                      >
                        {msg.text}
                      </div>

                      {/* 10. CONVERSATION MINI PROPERTY CARDS */}
                      {msg.property && (
                        <div className="w-full max-w-[260px] bg-card border border-border/80 rounded-2xl overflow-hidden shadow-md space-y-2 mt-2 text-left">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                            <img
                              src={msg.property.image}
                              alt={msg.property.name}
                              className="w-full h-full object-cover"
                            />
                            {msg.property.isVerified && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary text-primary-foreground">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold text-secondary uppercase">{msg.property.type}</span>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span>{msg.property.rating}</span>
                              </div>
                            </div>
                            <h5 className="font-heading text-xs font-extrabold text-primary truncate leading-snug">{msg.property.name}</h5>
                            <p className="font-body text-[10px] text-muted-foreground truncate">{msg.property.location}</p>
                            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                              <span className="font-heading text-xs font-extrabold text-primary">₹{msg.property.price.toLocaleString()}/mo</span>
                              <Link
                                href={`/property/${msg.property.id}`}
                                className="px-3 py-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-[10px] font-bold rounded-lg transition-all"
                              >
                                View Property
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. SMART TIMESTAMP GROUPING */}
                      {showTime && (
                        <span className="text-[9px] text-muted-foreground px-1">{msg.timestamp}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* TYPING ANIMATION */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mr-auto flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-card border border-border/80 rounded-2xl rounded-bl-xs text-xs text-muted-foreground w-16 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* 9. QUICK ACTIONS BAR ABOVE INPUT */}
            <div className="px-3 py-2 bg-card border-t border-border/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-left">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest shrink-0 mr-1">
                Quick Actions:
              </span>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleSendMessage(action.prompt)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground border border-border/60 text-[10px] font-semibold shrink-0 transition-all cursor-pointer active:scale-95"
                  >
                    <Icon className="w-3 h-3 text-secondary shrink-0" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 7. UPGRADED INPUT AREA */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-card border-t border-border/80 flex items-center gap-2 shrink-0"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask RoofAI anything about PGs, Hostels or Rooms..."
                className="flex-1 bg-muted/40 border border-border/80 rounded-2xl px-3.5 py-2.5 text-xs font-body text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none max-h-24"
              />

              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
