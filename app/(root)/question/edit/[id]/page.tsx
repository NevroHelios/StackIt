import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { id: string };
}

const EditQuestionPage = async ({ params: { id } }: Props) => {
  const { userId: clerkId } = auth();
  if (!clerkId) return null;

  const mongoUser = await getUserById({ userId: clerkId });

  const { question } = await getQuestionById({ questionId: id });
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="h1-bold text-dark100_light900 mb-2">Edit Question</h1>
      <p className="body-regular text-dark500_light700 mb-8">
        Update your question details, content, and tags.
      </p>
      <div className="mt-9">
        <Question
          type="edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </div>
  );
};

export default EditQuestionPage;

export async function generateMetadata(
  { params: { id } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params

  // fetch data
  const { question } = await getQuestionById({
    questionId: id,
  });
  // construct description based on user data
  const description = `Edit the question "${question.title}" on Dev Overflow. Update the content, tags, and details of your question.`;

  return {
    title: `Edit: ${question.title} | Dev Overflow`,
    description
  };
}
