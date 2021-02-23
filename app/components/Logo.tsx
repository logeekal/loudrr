import React from 'react';

import {Box, Image, Text} from '@chakra-ui/react';


export default function Logo(props) {
    return (
        <Box display="flex" direction="row" alignItems="center" justifyContent="center">
            <Image src="/assets/images/logo.png" width={"30px"}/>
            <Text ml={1}>
                TalkToMe
            </Text>
        </Box>
    )
}
