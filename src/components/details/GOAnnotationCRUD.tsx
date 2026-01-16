type GOAnnotationCRUDProps = {
  id: string;
  gene: string;
};

const GOAnnotationCRUD: React.FC<GOAnnotationCRUDProps> = ({ id }) => {
  return <div id={id}>GO Anotation CRUD</div>;
};

export default GOAnnotationCRUD;
