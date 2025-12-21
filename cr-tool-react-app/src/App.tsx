import { Box } from '@chakra-ui/react';
import CardBattle from './pages/CardBattlePage';
import Header from './components/Header';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/chakraTheme';
import { CardProvider } from './contexts/CardContext';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CardProvider>
        <Box
          width={'100vw'}
          minHeight={'100vh'}
          mx="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          overflow="auto"
        >
          <Header />
          <CardBattle />
        </Box>
      </CardProvider>
    </ChakraProvider>
  );
}
export default App;
