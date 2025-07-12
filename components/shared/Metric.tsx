import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: number | string;
  title?: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`${href ? "rounded-full" : "invert-colors"} object-contain flex-shrink-0`}
      />
      <p className={`flex items-center gap-1 ${textStyles}`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor && "max-sm:hidden"}`}
        >
          {title}
        </span>
      </p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="flex-center gap-1 hover:opacity-80 transition-all duration-200 hover:text-primary-500">
        {metricContent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
