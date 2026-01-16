type PhenotypeCRUDProps = {
  id: string;
  gene: string;
};

const PhenotypeCRUD: React.FC<PhenotypeCRUDProps> = ({ id }) => {
  return <div id={id}>Phenotype CRUD</div>;
};

export default PhenotypeCRUD;
