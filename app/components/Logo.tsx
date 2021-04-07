import React from 'react';

import {Box, Image, Text} from '@chakra-ui/react';


export default function Logo(props) {
    return (
        <Box display="flex" direction="row" alignItems="center" justifyContent="center">
            <Image src="/assets/logo/logo-transparent.svg" width={"100px"} m={-2}/>
        </Box>
    )
}
