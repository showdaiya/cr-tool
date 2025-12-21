import { Box, Heading } from '@chakra-ui/react'

const Header = () => (
  <Box position="fixed" top={0} left={0} right={0} zIndex={1000}>
    <Box as="header" py={4} bg="blue.100" width="100%" height={"55px"} color="gray.800" p={4}>
      <Heading size="lg" display="flex" alignItems="center" height="100%">Clash Royale ダメージ計算</Heading>
    </Box>
  </Box>
)
export default Header
