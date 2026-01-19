import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Sequence } from "@/utils/services/geneService";

type ViewSequencesButtonProps = {
  text: string;
  title: string;
  sequences: Sequence[];
  icon: string;
};

const ViewSequencesButton: React.FC<ViewSequencesButtonProps> = ({
  text,
  title,
  sequences,
  icon,
}) => {
  const padEvery = (str: string, numChar: number) => {
    if (!str) {
      return "";
    }
    const regex = new RegExp(`.{1,${numChar}}`, "g");
    return str.match(regex)?.join(" ");
  };

  const lineCount = sequences.reduce((sum, sequence) => {
    return sum + 1 + Math.ceil(sequence.seq.length / 10 / 3);
  }, 0);

  console.log("lineCount", lineCount);

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary">
        <Icon name={icon} className="text-base" />
        {text}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto border-y border-slate-100 bg-slate-50">
          <div className="relative flex overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 text-xs text-slate-400 font-mono select-none leading-[22.75px]">
              {Array(lineCount)
                .fill(1)
                .map((_, idx) => (
                  <span key={idx}>{(idx + 1).toString().padStart(2, "0")}</span>
                ))}
              <div className="absolute left-0 bottom-0 w-full h-4 bg-slate-100" />
            </div>

            <div className="flex-1 ml-12 pl-4 pr-6 py-4">
              <pre className="font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {sequences.map((sequence) => (
                  <>
                    <span className="text-primary font-bold">{`>${sequence.id}`}</span>
                    {"\n"}
                    {padEvery(sequence.seq, 10)}
                    {"\n"}
                  </>
                ))}
              </pre>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Icon name="content_copy" className="text-lg" />
              Copy
            </Button>
          </DialogClose>
          <Button variant="primary">
            <Icon name="download" className="text-lg" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSequencesButton;
