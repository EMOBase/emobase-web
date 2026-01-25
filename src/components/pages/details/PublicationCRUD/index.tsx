import { useEffect } from "react";

import { Icon } from "@/components/ui/icon";
import useAsyncData from "@/hooks/useAsyncData";
import { fetchByGene } from "@/utils/services/publicationService";

import AddPublicationButton from "./AddPublicationButton";
import PublicationList from "./PublicationList";
import usePublications from "./usePublications";

type PublicationCRUDProps = {
  id: string;
  title: string;
  gene: string;
};

const PublicationCRUD: React.FC<PublicationCRUDProps> = ({
  id,
  title,
  gene,
}) => {
  const { data, loading } = useAsyncData(() => fetchByGene(gene), []);

  const publications = usePublications((state) => state.data);
  const setPublications = usePublications((state) => state.setData);

  useEffect(() => {
    if (data) setPublications(data);
  }, [data]);

  return (
    <div id={id}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="menu_book" weight={500} className="text-primary" />
          {title}
        </h2>
        <AddPublicationButton />
      </div>

      <PublicationList loading={loading} publications={publications} />
    </div>
  );
};

export default PublicationCRUD;
