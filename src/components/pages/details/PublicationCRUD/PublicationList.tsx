import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import BeetleLoading from "@/components/common/BeetleLoading";
import type { Publication } from "@/utils/constants/publication";

const getAuthorSummary = (publication: Publication) => {
  const firstAuthor = publication.authors[0];
  const numOfAuthors = publication.authors.length;
  if (numOfAuthors === 1) {
    return firstAuthor.firstName + " " + firstAuthor.lastName;
  } else if (numOfAuthors === 2) {
    const secondAuthor = publication.authors[1];
    return firstAuthor.lastName + " and " + secondAuthor.lastName;
  } else if (numOfAuthors > 2) {
    return firstAuthor.lastName + " et al.";
  }
};

const getFullAuthors = (publication: Publication) => {
  return publication.authors
    .map(({ firstName, lastName }) => firstName + " " + lastName)
    .join(", ");
};

type PublicationItemProps = {
  publication: Publication;
  className?: string;
};

const PublicationItem: React.FC<PublicationItemProps> = ({
  publication,
  className,
}) => {
  const [full, setFull] = useState(false);

  const verticalRule = !full && (
    <span className="h-3 w-px bg-neutral-300"></span>
  );

  return (
    <div className={twMerge(`space-y-1.5`, className)}>
      <a
        href={`https://doi.org/${publication.doi}`}
        target="_blank"
        className="group/link text-base font-semibold hover:text-primary cursor-pointer inline-flex justify-between gap-2 transition-colors leading-tight w-full"
      >
        {publication.title}
        <Icon
          name="open_in_new"
          className="text-xl text-neutral-400 group-hover/link:text-primary transition-colors"
        />
      </a>
      <div
        className={twMerge(
          "flex text-[13px] text-neutral-500 gap-x-3 gap-y-0.5",
          full
            ? "flex-col [&>div>span:first-child]:w-[55px]"
            : "flex-wrap items-center",
        )}
      >
        <div className="flex items-center">
          <span className="mr-1">
            {publication.authors.length > 1 ? "Authors" : "Author"}:
          </span>
          <span className="text-neutral-700 font-medium">
            {full ? getFullAuthors(publication) : getAuthorSummary(publication)}
          </span>
        </div>
        {verticalRule}
        <div className="flex items-center">
          <span className="mr-1">Journal:</span>
          <span className="text-neutral-700 italic">{publication.journal}</span>
        </div>
        {verticalRule}
        <div className="flex items-center">
          <span className="mr-1">Year:</span>
          <span className="text-neutral-700">{publication.year}</span>
        </div>
        {full && (
          <div className="flex">
            <span className="mr-1">Abstract:</span>
            <span className="text-neutral-700">{publication.abstract}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => setFull((f) => !f)}
          className="px-3 py-1 rounded bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider"
        >
          {full ? "Less" : "More"}
        </button>
        <button
          onClick={() => {}}
          className="px-3 py-1 rounded bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider"
        >
          Cite
        </button>
      </div>
    </div>
  );
};

type PublicationListProps = {
  loading: boolean;
  publications: Publication[];
};

const PublicationList: React.FC<PublicationListProps> = ({
  loading,
  publications,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
      {loading ? (
        <div className="relative h-40">
          <BeetleLoading title="Getting Data" />
        </div>
      ) : publications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-40">
          <Icon name="search_off" className="text-neutral-300 text-5xl mb-4" />
          <p className="text-neutral-400 text-sm">
            No publications found associated with this gene.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {publications.map((pub, idx) => (
            <PublicationItem
              publication={pub}
              key={pub.id}
              className={idx !== 0 ? "pt-6 border-t border-neutral-100" : ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicationList;
