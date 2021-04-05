import { Box, Text, Link, Image, Flex } from "@chakra-ui/react";
import React from "react";

const HeroBlock = ({ imageSrc, imageCaption, caption }) => {
  return (
    <Flex maxW="20rem" boxShadow="lg" p={2} borderRadius="md" direction="column" alignItems="center">
      <Box m={2}>
        <Image
          borderRadius="lg"
          src={imageSrc || "https://picsum.photos/100"}
          alt={imageCaption || "Sample Hero Card"}
          width="200px"
        />
      </Box>
      <Box p={5}>
        <Link mt={1} fontWeight="bold" fontSize="lg">
          {caption || "Sample Captions"}
        </Link>
        <Text mt={2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
          quasi maiores sit aliquam officia reprehenderit optio quibusdam
          similique excepturi? Ea vero mollitia esse nobis dolore maxime
          distinctio quisquam magni iusto!
        </Text>
      </Box>
    </Flex>
  );
};

export default HeroBlock;
