import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center p-6 rounded-lg background-light900_dark200">
      <Image
        src="/assets/images/light-illustration.png"
        alt="no result illustration"
        height={200}
        width={270}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="no result illustration"
        height={200}
        width={270}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8 text-center">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-6 py-3 text-light-900 hover:bg-primary-600 dark:bg-primary-500 dark:text-light-900 transition-all duration-200 shadow-lg hover:shadow-xl">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
