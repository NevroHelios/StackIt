import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";
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

interface QuestionCardProps {
  question?: {
    _id: string;
    title: string;
    tags: Tag[];
    author: Author;
    upvotes: any[];
    views: number;
    answers: any[];
    createdAt: Date;
  };
  clerkId?: string | null;
  // Legacy props for backward compatibility
  _id?: string;
  title?: string;
  tags?: Tag[];
  author?: Author;
  upvotes?: any[];
  views?: number;
  answers?: any[];
  createdAt?: Date;
}

const QuestionCard = ({ 
  question, 
  clerkId,
  _id: legacyId,
  title: legacyTitle,
  tags: legacyTags,
  author: legacyAuthor,
  upvotes: legacyUpvotes,
  views: legacyViews,
  answers: legacyAnswers,
  createdAt: legacyCreatedAt
}: QuestionCardProps) => {
  // Use question object if available, otherwise use legacy props
  const _id = question?._id || legacyId;
  const title = question?.title || legacyTitle;
  const tags = question?.tags || legacyTags || [];
  const author = question?.author || legacyAuthor;
  const upvotes = question?.upvotes || legacyUpvotes || [];
  const views = question?.views || legacyViews || 0;
  const answers = question?.answers || legacyAnswers || [];
  const createdAt = question?.createdAt || legacyCreatedAt;

  if (!_id || !title || !author) {
    return null; // Return null if essential props are missing
  }

  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="group relative rounded-xl border border-emerald-100/20 bg-gradient-to-br from-white/80 to-emerald-50/30 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-200/40 hover:shadow-xl hover:shadow-emerald-100/20 dark:from-gray-900/80 dark:to-emerald-900/10 dark:border-emerald-800/20 dark:hover:border-emerald-700/40 sm:px-11">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-50/10 to-green-50/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-900/10 dark:to-green-900/10" />
      
      <div className="relative z-10">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div className="flex-1">
            <span className="subtle-regular text-muted-foreground line-clamp-1 flex animate-fade-in-up sm:hidden">
              {createdAt ? getTimestamp(createdAt) : 'Unknown time'}
            </span>
            <Link href={`/question/${_id}`}>
              <h3 className="sm:h3-semibold base-semibold text-foreground line-clamp-2 flex-1 transition-colors duration-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                {title}
              </h3>
            </Link>
          </div>
          <SignedIn>
            {showActionButtons && (
              <div className="animate-fade-in">
                <EditDeleteAction type="question" itemId={JSON.stringify(_id)} />
              </div>
            )}
          </SignedIn>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {tags.map((tag, index) => (
            <div 
              key={tag._id} 
              className="animate-scale-in"
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <RenderTag _id={tag._id} name={tag.name} />
            </div>
          ))}
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Metric
            imgUrl={author.picture}
            alt="user"
            value={author.name}
            title={` - asked ${createdAt ? getTimestamp(createdAt) : 'Unknown time'}`}
            href={`/profile/${author._id}`}
            isAuthor
            textStyles="body-medium text-muted-foreground"
          />
          <div className="flex items-center gap-4 max-sm:flex-wrap max-sm:justify-start">
            <div className="animate-slide-in-right" style={{ animationDelay: "250ms" }}>
              <Metric
                imgUrl="/assets/icons/like.svg"
                alt="Upvotes"
                value={formatNumber(upvotes.length)}
                title=" Votes"
                textStyles="small-medium text-muted-foreground"
              />
            </div>
            <div className="animate-slide-in-right" style={{ animationDelay: "300ms" }}>
              <Metric
                imgUrl="/assets/icons/message.svg"
                alt="message"
                value={formatNumber(answers.length)}
                title=" Answers"
                textStyles="small-medium text-muted-foreground"
              />
            </div>
            <div className="animate-slide-in-right" style={{ animationDelay: "350ms" }}>
              <Metric
                imgUrl="/assets/icons/eye.svg"
                alt="eye"
                value={formatNumber(views)}
                title=" Views"
                textStyles="small-medium text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
