import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Tag {
  name: string;
  _id: string;
}

interface Author {
  _id: string;
  name: string;
  picture: string;
  clerkId: string;
}

interface Props {
  clerkId?: string | null;
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper rounded-[10px] p-4 sm:p-6 lg:p-9 lg:px-11 hover:shadow-lg transition-all duration-200 border border-light-800 dark:border-dark-300">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex-1 w-full">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden mb-2">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2 flex-1 hover:text-primary-500 transition-colors mb-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture || "/assets/icons/avatar.svg"}
          alt="User"
          value={author.name}
          title={`- asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start max-sm:w-full max-sm:mt-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={getFormattedNumber(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={getFormattedNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Eye"
            value={getFormattedNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
