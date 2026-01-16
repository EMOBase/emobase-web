type PublicationCRUDProps = {
  id: string;
  gene: string;
};

const PublicationCRUD: React.FC<PublicationCRUDProps> = ({ id }) => {
  return <div id={id}>Publication CRUD</div>;
};

export default PublicationCRUD;
