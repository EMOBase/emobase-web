import TableOfContents from "@/components/common/TableOfContents";
import { stringToURLHash } from "@/utils/stringToURLHash";

import ImageReview from "./ImageReview";

const GOAnnotationReview = () => {
  return <div>GO Annotation Review</div>;
};

type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
  const sections = [
    {
      header: "Image Review",
      component: ImageReview,
      props: {},
    },
    {
      header: "GO Annotation Review",
      component: GOAnnotationReview,
      props: {},
    },
  ];

  const getSectionId = ({
    header,
    shortHeader,
  }: {
    header: string;
    shortHeader?: string;
  }) => {
    return stringToURLHash(shortHeader || header);
  };

  const toc = sections.map((panel) => ({
    id: getSectionId(panel),
    title: panel.header,
  }));

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      <div className="flex-1 flex flex-col gap-10 min-w-0">
        {sections.map((section) => {
          const sectionId = getSectionId(section);
          const props = section.props;
          const Component = section.component as React.FC<
            typeof props & { id: string; title: string }
          >;

          return (
            <Component
              key={sectionId}
              id={sectionId}
              title={section.header}
              {...props}
            />
          );
        })}
      </div>
      <TableOfContents items={toc} />
    </div>
  );
};

export default Dashboard;
