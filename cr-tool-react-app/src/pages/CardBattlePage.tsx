'use client';

import { Box, Flex, Heading, Stack, VStack } from '@chakra-ui/react';
//import { Heart, Sword, Fire } from "lucide-react";

import { AttackCardSection } from '../components/AttackCardSection';
import { DefenceCard } from '../components/DefenceCard';

//import { useTroops, useSpells } from '../contexts/CardContext';

export default function CardBattle() {
  //const troopData = useTroops();
  //const spellData = useSpells();

  // 確認用
  //console.log('cardBattlePage', troopData);
  //console.log('cardBattlePage', spellData);

  //console.log('cardBattlePage', troopData["Archers"]);

  /*
  // 攻撃側カードのプルダウン用のリスト
  const attackCardList = [...Object.keys(troopData), ...Object.keys(spellData)].map(cardName => (
    <option key={cardName} value={cardName}>
      {troopData[cardName]?.JpName || spellData[cardName]?.JpName}
    </option>
  ));
*/
  return (
    <Box width="100%" minHeight="100vh" display="flex" justifyContent="center">
      <Box width="100%" maxW="1400px" py={'65px'} px={8}>
        <VStack spacing={8} w="full">
          {/* Receiving Card Section */}
          <Stack w="full" spacing={3}>
            <Flex justify="space-between" align="center" height={10}>
              <Heading size="md">防衛側</Heading>
            </Flex>
            <DefenceCard />
          </Stack>

          {/* Attacking Cards Section */}
          <AttackCardSection />
        </VStack>
      </Box>
    </Box>
  );
}
