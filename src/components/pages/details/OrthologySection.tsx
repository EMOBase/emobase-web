type OrthologySectionProps = {
  id: string;
  gene: string;
};

const OrthologySection: React.FC<OrthologySectionProps> = ({ id }) => {
  return (
    <div id={id} className="h-[500px]">
      Closest Fly Homologs
    </div>
  );
};

export default OrthologySection;
