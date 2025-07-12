import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import Metric from "@/components/shared/Metric";
import JobBadge from "@/components/jobs/JobBadge";

import {
  employmentTypeConverter,
  getFormattedSalary,
  getTimestamp,
  isValidImage,
} from "@/lib/utils";

interface JobProps {
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  requiredSkills: string[];
  applyLink: string;
  employerLogo: string;
  employerWebsite: string;
  employerName: string;
  employmentType: string;
  isRemote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  postedAt: string;
}

const JobCard = ({
  title,
  description,
  city,
  state,
  country,
  requiredSkills,
  applyLink,
  employerLogo,
  employerWebsite,
  employerName,
  employmentType,
  isRemote,
  salary,
  postedAt,
}: JobProps) => {
  const imageUrl = isValidImage(employerLogo)
    ? employerLogo
    : "/assets/images/site-logo.svg";

  const location = `${city ? `${city}${state ? ", " : ""}` : ""}${state || ""}${city && state && country ? ", " : ""
    }${country || ""}`;

  return (
    <section className="card-wrapper rounded-[10px] p-6">
      <div className="flex w-full gap-4">
        <Image
          src={imageUrl}
          alt="company logo"
          width={64}
          height={64}
          className="rounded-[10px]"
        />
        <div className="w-full">
          <div className="flex-between">
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {title}
            </h3>
            <div className="hidden items-center gap-2 md:flex">
              {location && (
                <Image
                  src={`/assets/icons/location.svg`}
                  alt="location"
                  width={20}
                  height={20}
                />
              )}
              <p className="body-medium text-light-500">{location}</p>
            </div>
          </div>
          <p className="body-regular text-dark500_light500 mt-2 line-clamp-2">
            {description.slice(0, 200)}
          </p>
          <div className="flex-between mt-8 flex-wrap gap-y-6">
            <div className="flex gap-2">
              <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
                {employmentTypeConverter(employmentType)}
              </Badge>
              {isRemote && (
                <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
                  Remote
                </Badge>
              )}
              {getFormattedSalary(salary) && (
                <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
                  {getFormattedSalary(salary)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={`/assets/icons/clock-2.svg`}
                alt="clock"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">
                {getTimestamp(new Date(postedAt))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCard;