import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface HeroHeadingProps {
  text: string;
  indices: Array<number>;
}

const HeroHeading: React.FC<HeroHeadingProps> = ({ text, indices }) => {
  return (
    <Box>
      {text.split(" ").map((word, index) => {
          let newWord = index !== 0 ? " " + word : word
        return (
          <Heading as="span" color={indices.includes(index) ? "#AC36C9" : "black"} fontSize={{base:"45px", md:"80px"}} >
            {newWord}
          </Heading>
        );
      })}
    </Box>
  );
};


export const HeroText = ({children}) => {
    return <Text fontSize="20px" color="gray.500" fontWeight="semi-bold" width="full" px={1} >
        {children}
    </Text>
}

export default HeroHeading;
