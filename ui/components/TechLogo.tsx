import { VStack, Image, Text, Avatar } from "@chakra-ui/react";

interface TechLogoProps {
  name?: string;
  src?: string;
  title: string;
  bg: string;
}

const TechLogo = (props: TechLogoProps) => {
  return (
    <VStack>
      <Avatar src={props.src || `/assets/logo/${props.name}.png`} alt="title" w="100px" h="auto" bg={props.bg} p={5}/>
      <Text color="white" marginBlockStart={2}>{props.title}</Text>
    </VStack>
  );
};

export default TechLogo;
