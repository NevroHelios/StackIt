import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { ITag } from "@/database/tag.model";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const DynamicAnswer = dynamic(() => import("@/components/forms/Answer"), {
  ssr: false, // TinyMCE requires client-side rendering
});

const QuestionDetailPage = async ({
  params: { id },
  searchParams,
}: URLProps) => {
  const { question } = await getQuestionById({ questionId: id });
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  } else {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-none overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Header Section with Author and Votes */}
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          {/* Author Info */}
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-2 hover:opacity-80 transition-opacity order-2 sm:order-1"
          >
            <Image
              src={question.author.picture}
              alt="profile"
              className="rounded-full flex-shrink-0"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700 truncate min-w-0">
              {question.author.name}
            </p>
          </Link>
          
          {/* Votes Section */}
          <div className="flex justify-start sm:justify-end order-1 sm:order-2">
            <Votes
              type="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={question.upvotes.length}
              hasUpVoted={question.upvotes.includes(mongoUser._id)}
              downvotes={question.downvotes.length}
              hasDownVoted={question.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        
        {/* Question Title */}
        <h2 className="h2-semibold text-dark200_light900 mt-4 w-full text-left break-words overflow-x-auto hyphens-auto">
          {question.title}
        </h2>
      </div>

      {/* Metrics Section */}
      <div className="mb-6 mt-6 flex flex-wrap gap-3 sm:gap-4 md:gap-6">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={getFormattedNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Eye"
          value={getFormattedNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      {/* Question Content */}
      <div className="w-full overflow-hidden mb-6">
        <ParseHTML data={question.content} />
      </div>

      {/* Tags Section */}
      <div className="mt-6 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag: ITag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
      </div>

      {/* All Answers Section */}
      <div className="w-full overflow-hidden mb-8">
        <AllAnswers
          questionId={JSON.stringify(question._id)}
          userId={mongoUser._id}
          totalAnswers={question.answers.length}
          filter={searchParams?.filter}
          page={searchParams?.page ? +searchParams.page : 1}
        />
      </div>

      {/* Answer Form Section */}
      <div className="w-full overflow-hidden">
        <DynamicAnswer
          question={question.content}
          questionId={JSON.stringify(question._id)}
          authorId={JSON.stringify(mongoUser)}
        />
      </div>
    </div>
  );
};

export default QuestionDetailPage;

export async function generateMetadata(
  { params: { id } }: URLProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params

  // fetch data
  const { question } = await getQuestionById({
    questionId: id,
  });
  // construct description based on user data
  const description = `Find answers and discussions about the question "${question.title}" on Dev Overflow.`;

  return {
    title: `${question.title} | Dev Overflow`,
    description
  };
}
