import { Icon } from "@/components/ui/icon";
import { type IBDsRNA } from "@/utils/constants/ibeetle";

import ViewSequencesButton from "./ViewSequencesButton";

type SequenceListProps = {
  dsrna: IBDsRNA;
};

const SequenceList: React.FC<SequenceListProps> = ({ dsrna }) => {
  const sequencesButtons = [
    {
      title: `${dsrna.id} left primer`,
      text: "View left primer",
      leftIcon: <Icon name="chevron_left" className="text-lg" />,
      sequences: [
        {
          id: `${dsrna.id} left primer`,
          seq: dsrna.leftPrimer,
        },
      ],
    },
    {
      title: `${dsrna.id} dsRNA sequence`,
      text: "View dsRNA sequence",
      leftIcon: <Icon name="genetics" className="text-base" />,
      sequences: [
        {
          id: `${dsrna.id}`,
          seq: dsrna.seq,
        },
      ],
    },
    {
      title: `${dsrna.id} right primer`,
      text: "View right primer",
      rightIcon: <Icon name="chevron_right" className="text-lg" />,
      sequences: [
        {
          id: `${dsrna.id} right primer`,
          seq: dsrna.rightPrimer,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      {sequencesButtons.map((props, index) => (
        <>
          {index > 0 && <span className="text-neutral-300">|</span>}
          <ViewSequencesButton key={props.text} {...props} />
        </>
      ))}
    </div>
  );
};

export default SequenceList;
