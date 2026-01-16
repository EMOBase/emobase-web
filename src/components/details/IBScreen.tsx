import { type IBDsRNA } from "@/utils/constants/ibeetle";
import { type Phenotype } from "@/utils/constants/phenotype";

type IBScreenProps = {
  id: string;
  dsrna: IBDsRNA;
  phenotypes: Phenotype[];
};

const IBScreen: React.FC<IBScreenProps> = ({ id }) => {
  return <div id={id}>IBScreen</div>;
};

export default IBScreen;
