type OrthologySectionProps = {
  id: string;
  gene: string;
};

const OrthologySection: React.FC<OrthologySectionProps> = ({ id }) => {
  return <div id={id}>Orthology section</div>;
};

export default OrthologySection;
