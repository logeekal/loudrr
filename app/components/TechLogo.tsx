import { VStack, Image, Text, Avatar, AvatarProps } from "@chakra-ui/react";
import { SizeType } from "antd/lib/config-provider/SizeContext";

interface TechLogoProps {
  name?: string;
  src?: string;
  title: string;
  bg: string;
  size?: SizeType;
}

const TechLogo = (props: TechLogoProps) => {
  return (
    <VStack paddingTop={5} className={"techlogo"}>
      <Avatar
        src={props.src || `/assets/logo/${props.name}.png`}
        alt="title"
        w="100px"
        h="auto"
        bg={props.bg}
        p={5}
        size={props.size || 'md'}
      />
      <Text color="white" marginBlockStart={2}>
        {props.title}
      </Text>
    </VStack>
  );
};

export default TechLogo;
