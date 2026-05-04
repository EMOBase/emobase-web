import goAnnotationService from "@/utils/services/goAnnotationService";
import useService from "@/hooks/useService";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { download } from "@/components/common/DownloadButton";

const DownloadReviewedGOTermsButton = ({
  className,
}: {
  className?: string;
}) => {
  const { fetchForOfficialSubmission } = useService(goAnnotationService);

  return (
    <Button
      variant="primary"
      onClick={() =>
        fetchForOfficialSubmission().then((result) =>
          download({
            content: result,
            filename: "go_ibb.xlsx",
            filetype: "xlsx",
          }),
        )
      }
      className={className}
    >
      <Icon name="download" className="text-lg" />
      Download Reviewed GO Terms
    </Button>
  );
};

export default DownloadReviewedGOTermsButton;
