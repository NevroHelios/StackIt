"use client";

import { formUrlQuery } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="item-center flex w-full justify-center gap-2 mt-8">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-dark-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2 shadow-md">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-dark-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
