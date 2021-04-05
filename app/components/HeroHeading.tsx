import { Box, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import React from 'react';
import { useEffect, useState } from "react";

interface HeroHeadingProps {
  text: string;
  indices: Array<number>;
}

const HeroHeading: React.FC<HeroHeadingProps> = ({ text, indices }) => {
  let wordCounter= 0;
  return (
    <Box width="full">
      {  

      text.split(" ").map((word, index) => {
          let newWord = index !== 0 ? " " + word : word
          let elementType = 'span'
          let result: ReactNode[] = [];
          let newLinePosition = newWord.indexOf(String.fromCharCode(10))
          if([0,1].includes(newLinePosition)){
            result.push(<br />)
            result.push(newWord)
          }else if (newLinePosition === newWord.length -1){
            result.push(newWord)
            result.push(<br />)
          }else{
            result.push(newWord)
          }
        return (
          <Heading as="span" color={indices.includes(index) ? "#AC36C9" : "black"} fontSize={{base:"45px", md:"80px"}} key={index} >
            {result}
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

export default React.memo(HeroHeading);
