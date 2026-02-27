import { Icon } from "@/components/ui/icon";

export type Link = {
  to: string;
  text?: string;
  comment?: string;
  download?: boolean;
};

type SectionProps = {
  header: string;
  links: Link[];
};

const ResourceLink = ({ link }: { link: Link }) => {
  return (
    <div className="group">
      <a
        href={link.to}
        target="_blank"
        download={link.download}
        className="group/link inline-flex items-center gap-2 text-primary font-semibold"
      >
        <span className="group-hover/link:underline decoration-2 underline-offset-4">
          {link.text ?? link.to}
        </span>
        <Icon
          name={link.download ? "download" : "open_in_new"}
          weight={500}
          className="text-lg text-primary/80"
        />
      </a>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
        {link.comment}
      </p>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ header, links }) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-8">
      <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-display font-bold text-slate-800">
          {header}
        </h3>
      </div>
      <div className="p-8 space-y-8">
        {links.map((link) => (
          <ResourceLink key={link.text} link={link} />
        ))}
      </div>
    </section>
  );
};

export default Section;
