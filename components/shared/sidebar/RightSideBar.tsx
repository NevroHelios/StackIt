import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSideBar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getPopularTags();

  return (
    <section className="custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l glass-morphism-emerald border-emerald-200/30 dark:border-emerald-700/30 p-6 pt-36 shadow-sm dark:shadow-none max-xl:hidden animate-fade-in">
      <div className="animate-fade-in-up">
        <h3 className="h3-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-green-300">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {hotQuestions.map((question, index) => (
            <div
              key={question._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <Link
                href={`/question/${question._id}`}
                className="group flex cursor-pointer items-center justify-between gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 hover:scale-105 hover:shadow-md relative overflow-hidden"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-green-50/20 dark:from-emerald-900/20 dark:to-green-900/10 opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-xl" />
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
                
                <div className="relative z-10 flex items-center justify-between w-full gap-4">
                  <p className="body-medium text-muted-foreground line-clamp-2 flex-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                    {question.title}
                  </p>
                  <div className="flex-shrink-0 relative">
                    <img
                      src="/assets/icons/chevron-right.svg"
                      alt="chevron right"
                      width={20}
                      height={20}
                      className="invert-colors transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    />
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Left border accent */}
                <div className="absolute left-0 top-0 w-1 h-0 bg-gradient-to-b from-emerald-500 to-green-500 transition-all duration-300 group-hover:h-full rounded-r-full" />
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <h3 className="h3-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-green-300">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag, index) => (
            <div
              key={tag._id}
              className="animate-scale-in"
              style={{ animationDelay: `${400 + index * 75}ms` }}
            >
              <div className="group transition-all duration-300 hover:scale-105">
                <RenderTag
                  _id={tag._id}
                  name={tag.name}
                  totalQuestions={tag.numberOfQuestions}
                  showCount
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
