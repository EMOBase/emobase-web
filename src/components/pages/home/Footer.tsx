import React from "react";
import DOMPurify from "isomorphic-dompurify";

import { hasFeature } from "@/utils/features";

type FooterProps = {
  aboutTheData: string;
};

const Footer: React.FC<FooterProps> = ({ aboutTheData }) => {
  const sanitizedAboutData = DOMPurify.sanitize(aboutTheData);

  return (
    <footer className="mt-12 pt-12 border-t border-slate-200">
      <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
        <div className="max-w-2xl">
          <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">
            About the Data
          </h4>

          <div
            className="text-sm text-slate-500 leading-relaxed [&>p:not(:last-child)]:mb-2 [&_a]:text-primary [&_a]:hover:underline"
            dangerouslySetInnerHTML={{ __html: sanitizedAboutData }}
          />
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
