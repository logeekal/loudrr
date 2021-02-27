import { VStack, Image, Text, Avatar, AvatarProps, ThemingProps } from "@chakra-ui/react";
import { SizeType } from "antd/lib/config-provider/SizeContext";

interface TechLogoProps {
  name?: string;
  src?: string;
  title: string;
  bg: string;
  size?: ThemingProps<"Avatar">["size"];
  textColor?: string;
}

const TechLogo = (props: TechLogoProps) => {
  return (
    <VStack paddingTop={5} className={"techlogo"}>
      <Avatar
        src={props.src || `/assets/logo/${props.name}.png`}
        alt="title"
        bg={props.bg}
        p={2}
        size={props.size || "lg"}
      />
      <Text color={props.textColor || "white"} marginBlockStart={2} >
        {props.title}
      </Text>
    </VStack>
  );
};

export default TechLogo;
