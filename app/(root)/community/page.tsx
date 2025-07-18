import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filters";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Dev Overflow",
  description:
    "Dive into the vibrant community of over 1,000,000 developers on Dev Overflow. Connect, collaborate, and learn from fellow developers worldwide. Join us and be a part of the conversation!",
};

const CommunityPage = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
      </div>

      <Filters filters={UserFilters} />

      <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p className="text-center text-lg">No users yet</p>
            <Link
              href="/sign-up"
              className="mt-2 block text-lg font-bold text-primary-500 hover:text-primary-600"
            >
              Join to be the first!
            </Link>
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

export default CommunityPage;
