import React, { useContext } from "react";
import Recipient from "../Recipient/Recipient";
import { RecipientContext } from "../../../../contexts/RecipientContext";

function RecipientsList({ coords, setDestination }) {
  const { sortedRecipients } = useContext(RecipientContext);
  console.log(sortedRecipients);
  return (
    <>
      {sortedRecipients.map((recipient) => (
        <Recipient
          key={recipient.id}
          setDestination={setDestination}
          recipient={recipient}
          coords={coords}
        />
      ))}
    </>
  );
}

export default RecipientsList;
