import { ListIcon, ListItem } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsQuestionSquareFill } from "react-icons/bs";
import { MdQuestionAnswer } from "react-icons/md";
export interface QnAProps {
  question: ReactNode;
  answer: ReactNode;
}

export default function QnA(props: QnAProps) {
  return (
    <>
      <ListItem spacing={3} my={3}>
        <ListIcon as={BsQuestionSquareFill} color="green.500"/>
        {props.question}
      </ListItem>
      <ListItem>
        <ListIcon as={MdQuestionAnswer} color="green.500"/>
        {props.answer}
      </ListItem>
  </>
  );
}
