import { useState } from 'react';
import { Box, Card, CardBody, Flex, Image, VStack } from '@chakra-ui/react';
import { StatusIndicator } from './StatusIndicator';
import { GradientButton } from './common/GradientButton';
import { SelectDefenceOverlay } from './SelectDefenceOverlay';
import { useTroops, useSpells, useDefenseCard, useAttackCards } from '../contexts/CardContext';
import { useEffect } from 'react';

export const DefenceCard = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const troopData= useTroops();
  const spellData= useSpells();
  const [defenseCard] = useDefenseCard();
  const [attackCards] = useAttackCards();

  const attackCard1 = Object.keys(attackCards).length ? attackCards[0] : null;
  const displayCard = attackCard1 == null ? null : attackCard1.CardKey;
  const attackNum = attackCard1 == null ? null : attackCard1.AttackNumber;
  const type = attackCard1 == null ? null : attackCard1.Type;

  // contextの値の変更を監視
  useEffect(() => {
    // attackCardsの値が変更されたときの処理
    console.log("DefenceCard:", displayCard, attackNum, type);
  }, [displayCard, attackNum, type]);


  const attackTotalDamageCalc = (CardKey: string | null, AttackCardNumber: number, Type: "Troop" | "Spell" | null) => {
    if (!CardKey) return 0;
    if (Type === null) throw new Error("Type is null");
    const card = Type === "Troop" ? troopData[CardKey] : spellData[CardKey];
    //console.log("calc");
    return card.Damage * AttackCardNumber;
  };

  const hp = troopData[defenseCard].Hitpoints;
  const receivedDamage = Object.values(attackCards).reduce(
    (total, AttackCard) => total += attackTotalDamageCalc(AttackCard.CardKey, AttackCard.AttackNumber, AttackCard.Type),
    0
  );
  const remainingHp = hp - receivedDamage;

  return (
    <Box>
      {isOverlayOpen && (
        <SelectDefenceOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
      )}

      <Card
        w="full"
        border={'1px'}
        borderColor={'gray.300'}
        background={'gray.50'}
        boxShadow={'lg'}
        p={0}
      >
        <CardBody>
          <Flex justify="space-between" align="center">
            <Flex justify="flex-start" fontSize="sm" align="center">
              <Image
                src={`/resized_cards/${troopData[defenseCard].Icon}`}
                alt={`${troopData[defenseCard].JpName}の画像`}
                height="80px"
                objectFit="cover"
              />
              <VStack spacing={2} align="left" ml={4}>
                <StatusIndicator label="HP" value={hp} />
                <StatusIndicator label="被ダメージ" value={receivedDamage} />
                <StatusIndicator label="残りHP" value={remainingHp} />
              </VStack>
            </Flex>
            <GradientButton
              topColor="blue.400"
              bottomColor="blue.500"
              onClick={() => setIsOverlayOpen(true)}
            >
              選択
            </GradientButton>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};
