import { extendTheme } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'

const newTheme = extendTheme({
    ...theme,
    fonts: {
        heading: "Noto Sans",
        body: "Inter"
    }
})

export default newTheme;