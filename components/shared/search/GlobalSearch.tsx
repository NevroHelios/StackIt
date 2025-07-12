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
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={searchContainerRef}>
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;