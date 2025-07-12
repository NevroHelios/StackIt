import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import { getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Filter from "./Filter";
import Pagination from "./Pagination";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  filter,
  page,
}: Props) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page,
  });
  return (
    <div className="mt-11 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <h3 className="primary-text-gradient text-lg font-semibold">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div className="space-y-6">
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-8 hover:bg-light-850 dark:hover:bg-dark-300 transition-colors rounded-lg px-4 w-full max-w-full overflow-hidden">
            <div className="mb-6 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-2 sm:items-center hover:opacity-80 transition-opacity min-w-0"
              >
                <Image
                  src={answer.author.picture}
                  height={18}
                  width={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5 flex-shrink-0"
                />
                <div className="flex flex-col sm:flex-row sm:items-center min-w-0 flex-1">
                  <p className="body-semibold text-dark300_light700 truncate">
                    {answer.author.name}
                  </p>
                  <p className="small-regular text-dark400_light500 ml-0.5 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden"> -</span> answered{" "}
                    {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end max-sm:justify-start flex-shrink-0">
                <Votes
                  type="answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasUpVoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasDownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <ParseHTML data={answer.content} />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Pagination pageNumber={page!} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
