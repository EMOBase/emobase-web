import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SearchHelpModalProps {
  children: React.ReactElement;
}

const Eg = ({ children }: { children: string }) => (
  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs font-bold">
    {children}
  </code>
);

export const SearchHelpModal = ({ children }: SearchHelpModalProps) => {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="max-h-9/10 flex flex-col">
        <DialogHeader>
          <DialogTitle>Help: Search</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Section 01: Gene Search */}
          <div className="flex items-start gap-2.5">
            <span className="text-primary font-bold text-base">01.</span>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Gene search
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Utilize gene identifiers for{" "}
                <em className="italic">Tribolium</em> (e.g., TC number) or{" "}
                <em className="italic">Drosophila</em> (e.g. CG number, FBgn
                number), gene names (e.g., knirps, croc) or iBeetle number
                (e.g., iB_00108).
              </p>
            </div>
          </div>

          {/* Section 02: RNAi Phenotypes */}
          <div className="flex items-start gap-2.5">
            <span className="text-primary font-bold text-base">02.</span>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-base font-bold text-slate-900">
                Search for RNAi phenotypes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Search for{" "}
                <em className="italic font-semibold">
                  morphological structures
                </em>{" "}
                (e.g. <Eg>leg</Eg> or <Eg>elytra</Eg>) that were affected by an
                RNAi knock-down in the iBeetle screen.
              </p>
              <ul className="text-sm list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Your search for a structure (e.g. <Eg>leg</Eg>) will include
                  results for all substructures (e.g. <Eg>tarsus</Eg> and{" "}
                  <Eg>femur</Eg> and <Eg>coxa</Eg>
                  and …).
                </li>
                <li>
                  You may also search for other aspects such as the{" "}
                  <em className="italic font-semibold">
                    nature of a phenotypic change
                  </em>{" "}
                  (e.g. <Eg>colour</Eg> or <Eg>transformed</Eg>). Keep in mind
                  that the same phenotype can be described by different term
                  combinations (e.g., <Eg>leg shortened</Eg> or{" "}
                  <Eg>leg size decreased</Eg>), such that restricted searches
                  may not be comprehensive.
                </li>
                <li>
                  Combining terms such as <Eg>abdomen transformed</Eg> will only
                  reveal annotations where both terms are found in one phenotype
                  description. Of note, the results will include all
                  substructures such as <Eg>urogomphi transformed</Eg> because
                  urogomphi are part of the abdomen. To exclude urogomphi from
                  the results you can enter:{" "}
                  <Eg>abdomen transformed -urogomphi</Eg>.
                </li>
                <li>
                  Search term can be stage-specific, for example:{" "}
                  <Eg>larva head</Eg>, <Eg>pupal head</Eg> or{" "}
                  <Eg>adult head</Eg>.
                </li>
                <li className="space-y-2">
                  <p className="text-sm text-slate-600">
                    To perform complex queries, use the following logical
                    operators and syntax rules:
                  </p>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-md px-4 py-3 space-y-3">
                    <h5 className="text-xs font-bold text-primary uppercase tracking-widest">
                      Logical Operators
                    </h5>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-700">
                        <span className="font-bold">AND:</span> Results must
                        contain both terms (e.g.,{" "}
                        <code className="bg-slate-200/50 px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                          head AND wing
                        </code>
                        ).
                      </p>
                      <p className="text-xs text-slate-700">
                        <span className="font-bold">OR:</span> Results contain
                        either term (e.g.,{" "}
                        <code className="bg-slate-200/50 px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                          larva OR pupa
                        </code>
                        ).
                      </p>
                      <p className="text-xs text-slate-700">
                        <span className="font-bold">NOT:</span> Excludes a
                        specific term (e.g.,{" "}
                        <code className="bg-slate-200/50 px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                          NOT muscle
                        </code>
                        ).
                      </p>
                      <p className="text-xs text-slate-700">
                        Use brackets for more complex logical search (e.g.,{" "}
                        <code className="bg-slate-200/50 px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                          (head OR wing) AND NOT muscle
                        </code>
                        )
                      </p>
                    </div>
                  </div>
                </li>
              </ul>

              {/* Recommendation Box */}
              <div className="relative pl-5 mt-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-full" />
                <div className="bg-orange-50/30 border border-orange-100/50 rounded-r-md px-4 py-3">
                  <p className="text-slate-700 leading-relaxed text-[13px]">
                    We recommend{" "}
                    <span className="font-bold">80% penetrance</span> because
                    the iBeetle-Screen was a first-pass high-throughput screen,
                    which aimed at not missing any phenotype with the downside
                    of allowing false positive annotations. We found that
                    phenotypes with a penetrance of 50% or lower were often not
                    well reproducible. Still, valid phenotypes may be annotated
                    with lower penetrance, e.g. when several phenotypes with low
                    penetrance affect several substructures or when a high
                    overall penetrance of the affected structure would turn out
                    to be reliable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" size="sm" className="px-8">
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
