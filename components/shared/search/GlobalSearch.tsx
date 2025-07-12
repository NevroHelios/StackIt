"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Enhanced outside click handler
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsFocused(false);
      setIsExpanded(false);
    }
  }, []);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // CMD/CTRL + K to focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsExpanded(true);
      setIsFocused(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    // Escape to close
    if (event.key === 'Escape' && isExpanded) {
      setIsExpanded(false);
      setIsFocused(false);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [isExpanded]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim()) {
      setRecentSearches(prev => {
        const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOutsideClick, handleKeyDown]);

  // Reset states on pathname change
  useEffect(() => {
    setIsOpen(false);
    setIsFocused(false);
    setIsExpanded(false);
  }, [pathname]);

  // Enhanced debounced search with loading state
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (search) {
      setIsLoading(true);
    }

    debounceRef.current = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
        saveRecentSearch(search);
      } else {
        if (query) {
          const newUrl = removeKeysUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, pathname, router, searchParams, query, saveRecentSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
    if (!search && recentSearches.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsFocused(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(recentSearches.length > 0);
    }
  };

  const handleRecentSearchClick = (recentSearch: string) => {
    setSearch(recentSearch);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== searchToRemove);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      {/* Enhanced backdrop overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-300"
          onClick={() => {
            setIsExpanded(false);
            setIsFocused(false);
            setIsOpen(false);
          }}
        />
      )}
      
      <div
        className={`relative transition-all duration-500 ease-out ${
          isExpanded 
            ? "w-full max-w-4xl z-50 fixed top-20 left-1/2 transform -translate-x-1/2" 
            : "w-full max-w-[600px] max-lg:max-w-[400px] max-md:max-w-[300px]"
        } max-lg:hidden`}
        ref={searchContainerRef}
      >
        <div 
          className={`group relative flex min-h-[56px] items-center gap-3 rounded-2xl px-4 transition-all duration-500 ease-out cursor-text ${
            isExpanded 
              ? "glass-morphism-emerald shadow-2xl shadow-emerald-200/30 dark:shadow-emerald-900/40 border-2 border-emerald-300/60 dark:border-emerald-600/60 scale-105" 
              : isFocused
                ? "glass-morphism-emerald shadow-lg shadow-emerald-200/25 dark:shadow-emerald-900/35 border-2 border-emerald-300/40 dark:border-emerald-600/40 scale-[1.02]"
                : "glass-morphism-emerald hover:shadow-md hover:shadow-emerald-200/15 dark:hover:shadow-emerald-900/25 border border-emerald-200/30 dark:border-emerald-700/30 hover:border-emerald-300/50 dark:hover:border-emerald-600/50 hover:scale-[1.01]"
          }`}
          onClick={handleClick}
        >
          {/* Enhanced animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r from-emerald-50/60 via-green-50/40 to-emerald-50/60 dark:from-emerald-900/25 dark:via-green-900/15 dark:to-emerald-900/25 opacity-0 transition-all duration-500 rounded-2xl ${
            isFocused ? "opacity-100" : "group-hover:opacity-60"
          }`} />
          
          {/* Enhanced shimmer effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent opacity-0 transform -translate-x-full transition-all duration-1000 ease-out rounded-2xl ${
            isFocused ? "opacity-100 translate-x-full" : ""
          }`} />
          
          <div className="relative z-10 flex items-center gap-3 w-full">
            <div className="relative">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <Image
                  src="/assets/icons/search.svg"
                  width={24}
                  height={24}
                  alt="search"
                  className={`transition-all duration-300 ${
                    isFocused ? "scale-110 brightness-110" : "group-hover:scale-105"
                  }`}
                  style={{ filter: isFocused ? "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))" : "" }}
                />
              )}
              
              {/* Enhanced pulse effect when focused */}
              {isFocused && !isLoading && (
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-sm animate-pulse" />
              )}
            </div>
            
            <Input
              ref={inputRef}
              value={search}
              onChange={handleInputChange}
              onFocus={handleFocus}
              type="text"
              placeholder={isExpanded ? "Search anything across the platform..." : "Search Globally"}
              className={`paragraph-regular no-focus border-none bg-transparent shadow-none outline-none flex-1 transition-all duration-300 ${
                isFocused 
                  ? "text-emerald-900 dark:text-emerald-100 placeholder:text-emerald-600 dark:placeholder:text-emerald-400" 
                  : "text-muted-foreground placeholder:text-muted-foreground"
              }`}
            />
            
            {/* Enhanced search shortcut indicator */}
            {!isFocused && !isExpanded && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100/60 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-all duration-300 group-hover:bg-emerald-200/60 dark:group-hover:bg-emerald-800/60">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
            
            {/* Clear button when expanded and has content */}
            {isExpanded && search && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                  setIsOpen(recentSearches.length > 0);
                }}
                className="p-1.5 rounded-full hover:bg-emerald-100/60 dark:hover:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400 transition-all duration-200 hover:scale-110"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Enhanced search results with recent searches */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            isExpanded ? "z-50" : ""
          }`}>
            {/* Recent searches section */}
            {!search && recentSearches.length > 0 && (
              <div className="mb-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Recent Searches</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors duration-200"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((recentSearch, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleRecentSearchClick(recentSearch)}
                    >
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                          <path d="M3 3v5h5M3 21v-5h5M21 3v5h-5M21 21v-5h-5"/>
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{recentSearch}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(recentSearch);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 transition-all duration-200"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search results */}
            {search && <GlobalResult />}
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalSearch;