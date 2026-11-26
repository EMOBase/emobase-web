import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/classname";

type ExternalGeneLinkProps = {
  gene: string;
  species: string;
  assemblyInfoUrl?: string | null;
  version?: string;
  className?: string;
};

/**
 * A gene from a search result. Dmel is the only species with a hardcoded link
 * (FlyBase); every other species uses its assembly's info URL when one is
 * configured, and falls back to plain text when it is not.
 */
const ExternalGeneLink: React.FC<ExternalGeneLinkProps> = ({
  gene,
  species,
  assemblyInfoUrl,
  version,
  className,
}) => {
  const href = (() => {
    if (species === "Dmel") {
      return `https://flybase.org/reports/${encodeURIComponent(gene)}.html`;
    }
    if (!assemblyInfoUrl) return undefined;

    try {
      const url = new URL(assemblyInfoUrl);
      url.pathname = `/details/${encodeURIComponent(gene)}`;
      if (version) url.searchParams.set("version", version);
      return url.toString();
    } catch {
      const base = assemblyInfoUrl.replace(/\/+$/, "");
      const params = version
        ? `?${new URLSearchParams({ version }).toString()}`
        : "";
      return `${base}/details/${encodeURIComponent(gene)}${params}`;
    }
  })();

  if (!href) {
    return <span className={className}>{gene}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/link inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer",
        className,
      )}
    >
      <span className="group-hover/link:underline decoration-slate-700 underline-offset-2">
        {gene}
      </span>
      <Icon
        name="open_in_new"
        className="text-lg text-slate-400 group-hover/link:text-slate-600"
      />
    </a>
  );
};

export default ExternalGeneLink;
