import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

import PublicationList from "./PublicationList";

type PublicationCRUDProps = {
  id: string;
  title: string;
  gene: string;
};

const PublicationCRUD: React.FC<PublicationCRUDProps> = ({ id, title }) => {
  return (
    <div id={id}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="menu_book" weight={500} className="text-primary" />
          {title}
        </h2>
        <Button variant="outline" className="px-4 py-2">
          <Icon name="add" weight={500} className="text-xl" />
          Add a Publication
        </Button>
      </div>
      <PublicationList />
    </div>
  );
};

export default PublicationCRUD;
