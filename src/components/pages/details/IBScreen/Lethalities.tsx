import { Icon } from "@/components/ui/icon";

import BeetleLoading from "@/components/common/BeetleLoading";
import useAsyncData from "@/hooks/useAsyncData";
import phenotypeService from "@/utils/services/phenotypeService";

const { fetchLethality } = phenotypeService();

const LethalityRate = ({
  days,
  injection = "larva",
  rate,
  includes,
}: {
  days: number;
  injection?: "pupal" | "larva";
  rate: number;
  includes: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Icon name="warning" className="text-orange-500 text-lg shrink-0" />
      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        <span className="font-semibold">
          Lethalities {days} days after {injection} injection:
        </span>{" "}
        {rate}% (includes death as {includes})
      </p>
    </div>
  );
};

type LethalitiesProps = {
  dsrnaId: string;
};

const Lethalities: React.FC<LethalitiesProps> = ({ dsrnaId }) => {
  const { data, loading } = useAsyncData(
    () => fetchLethality(dsrnaId),
    [dsrnaId],
  );

  const dapi11 = data?.dapi11 || -1;
  const dali11 = data?.dali11 || -1;
  const dali22 = data?.dali22 || -1;

  if (loading) {
    return (
      <div className="relative h-40">
        <BeetleLoading title="Getting Data" />
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {dapi11 > 0 && (
        <LethalityRate
          days={11}
          injection="pupal"
          rate={dapi11}
          includes="pupa, adult"
        />
      )}
      {dali11 > 0 && (
        <LethalityRate
          days={11}
          rate={dali11}
          includes="larva, prepupa, pupa"
        />
      )}
      {dali22 > 0 && (
        <LethalityRate
          days={22}
          rate={dali22}
          includes="larva, prepupa, pupa, adult"
        />
      )}
    </div>
  );
};

export default Lethalities;
