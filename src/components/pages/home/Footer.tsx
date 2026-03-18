import React from "react";

import { hasFeature } from "@/utils/features";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-12 border-t border-slate-200">
      <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
        <div className="max-w-2xl">
          <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">
            About the Data
          </h4>

          <p className="text-sm text-slate-500 leading-relaxed mb-2">
            RNAi phenotypes documented in this database were collected in the
            iBeetle Screen, which was funded by the German Research Foundation
            (DFG) and BayerCrop Science. The development of the iBeetle-Base has
            been supported by DFG. Please refer to{" "}
            <a
              href="https://doi.org/10.1038/ncomms8822"
              target="_blank"
              className="text-primary hover:underline"
            >
              Schmitt-Engel et al. (2015)
            </a>{" "}
            and{" "}
            <a
              href="https://doi.org/10.1186/s12915-022-01231-4"
              target="_blank"
              className="text-primary hover:underline"
            >
              Hakeemi et al. (2022)
            </a>{" "}
            for details on the iBeetle Screen and to{" "}
            <a
              href="https://doi.org/10.1093/nar/gku1054"
              target="_blank"
              className="text-primary hover:underline"
            >
              Dönitz et al. (2015)
            </a>{" "}
            and{" "}
            <a
              href="https://doi.org/10.1093/nar/gkx984"
              target="_blank"
              className="text-primary hover:underline"
            >
              Dönitz et al (2018)
            </a>{" "}
            for the iBeetle-Base.
          </p>

          <p className="text-sm text-slate-500 leading-relaxed">
            NCBI is using another assembly (
            <a
              href="https://www.ncbi.nlm.nih.gov/nuccore/JANKOB000000000.1"
              target="_blank"
              className="text-primary hover:underline"
            >
              icTriCast1.1
            </a>
            ) based on long read sequencing
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Supported by
          </span>
          <div className="flex items-center gap-4 opacity-80 grayscale hover:grayscale-0 transition-all">
            <a
              href="https://www.dfg.de/"
              target="_blank"
              className="h-12 flex items-center"
            >
              <img src="/dfg.svg" className="h-full" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between text-xs text-slate-400">
        <p>© 2026 Universitätsmedizin Göttingen. All rights reserved.</p>
        {hasFeature("helpPages") && (
          <div className="flex gap-4">
            <a className="hover:text-slate-600" href="/help/about">
              About
            </a>
            <a className="hover:text-slate-600" href="/help/datenschutz">
              Data Protection
            </a>
            <a className="hover:text-slate-600" href="/help/impressum">
              Imprint
            </a>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
