import { IUser } from "@/database/user.model";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

interface Props {
  user: IUser;
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <div className="text-dark400_light800 shadow-light-100_darknone flex w-full flex-grow">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 hover:border-primary-500 dark:hover:border-primary-500">
        <Link
          href={`/profile/${user.clerkId}`}
          className="flex flex-col items-center justify-center group"
        >
          <Image
            src={user.picture}
            alt="user image"
            width={100}
            height={100}
            className="rounded-full group-hover:scale-105 transition-transform duration-200"
          />
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </Link>
        <div className="mt-5 w-full">
          {interactedTags.length > 0 ? (
            <div className="flex flex-wrap items-start gap-2 justify-center">
              {interactedTags.map((tag: any) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <Badge className="bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500">No tags yet</Badge>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
