import { Icon } from "@/components/ui/icon";

const Bold = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-bold text-slate-900">{children}</span>;
};

const Information = () => {
  return (
    <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <Icon name="history_edu" className="text-primary text-3xl" />
        <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
          Background Information
        </h2>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            iBeetle is a first-pass screen
          </h3>
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p>
              The iBeetle Screen is a{" "}
              <span className="font-bold text-slate-900">
                first-pass screen
              </span>
              , i.e. the experiments were performed only once and off target
              controls were not included. Further, we aimed at keeping false
              negative results as low as possible with the trade-off of elevated
              false positive annotations. Finally, we deliberately used an
              intermediate dsRNA concentration (1ug/ul) in order to reveal the
              phenotypic series. Hence, the data presented here needs to be
              confirmed with the original fragment and non-overlapping fragments
              of dsRNA before being publishable.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Annotation Terms
          </h3>
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed">
              Most phenotypes gathered in the iBeetle-Screen were annotated in a
              machine-readable way utilizing the{" "}
              <Bold>EQM (Entity-Quality-Modifier)</Bold> system. This includes
              the morphological <b>E</b>ntity that was affected (such as leg),
              the <Bold>Q</Bold>uality of the phenotype (such as size) and a{" "}
              <Bold>M</Bold>odifier that further describes the phenotype quality
              - for instance: "leg size decreased". The terms were chosen from
              controlled vocabularies.
            </p>

            <div className="mt-6 flex flex-col md:flex-row items-center md:items-center gap-3 bg-primary/5 p-4 rounded-xl">
              <Icon name="download" className="text-lg text-primary" />
              <p className="text-sm text-slate-600">
                The annotation list is downloadable under
                <a
                  href="/resources"
                  className="text-primary font-semibold hover:underline ml-1"
                >
                  Resources page
                </a>
                . See
                <a
                  href="https://doi.org/10.1038/ncomms8822"
                  target="_blank"
                  className="text-slate-900 font-medium underline ml-1"
                >
                  Schmitt-Engel et al. (2015)
                </a>{" "}
                or
                <a
                  href="https://doi.org/10.1093/nar/gku1054"
                  target="_blank"
                  className="text-slate-900 font-medium underline ml-1"
                >
                  Dönitz et al. (2015)
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Reproducibility
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Highly penetrant phenotypes with a direct phenotype-genotype
            relationship (e.g. lethality, wing blistering) were reproducible at
            a close to 100% rate in our hands. Regarding processes where the
            relation between gene function and phenotype is complex (e.g.
            embryonic development), the rate of reproducibility was between 70%
            and 80%. Reproducibility of low penetrance phenotypes (&lt;50%) was
            significantly lower.
          </p>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Rescreen strategy for the identification of morphological defects
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Phenotypes need to be confirmed by both the original dsRNA fragment
            (see sequence on the details page) and a non-overlapping fragment
            for off target control. A higher concentration (e.g. 3ug/ul) than
            the one used in the screen (1ug/ul) is recommended because in some
            cases, this will reveal s tronger phenotypes. For mid scale
            re-screening it may be advantageous to buy dsRNAs commercially from
            Eupheria.com.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Information;
