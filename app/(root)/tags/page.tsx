import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | Dev Overflow",
  description:
    "Explore a diverse range of tags used by developers on Dev Overflow. From popular frameworks like React and Next.js to specialized topics like machine learning and cybersecurity, discover the tags that categorize and organize the wealth of knowledge within our community.",
};

const TagsPage = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center mb-8">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
        <p className="body-regular text-dark500_light700 max-sm:text-center">
          Explore topics and technologies
        </p>
      </div>

      <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone flex flex-grow group"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-grow flex-col justify-center rounded-2xl border px-6 py-8 hover:shadow-lg transition-all duration-200 group-hover:border-primary-500 dark:group-hover:border-primary-500">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5 group-hover:bg-primary-100 dark:group-hover:bg-dark-300 transition-colors">
                  <p className="paragraph-semibold text-dark300_light900 capitalize group-hover:text-primary-500 transition-colors">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5 ">
                    {tag.questions.length}+
                  </span>{" "}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center col-span-full">
            <NoResult
              title="No Tags Found"
              description="It looks like there are no tags found."
              link="/ask-question"
              linkTitle="Ask a question"
            />
          </div>
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default TagsPage;
