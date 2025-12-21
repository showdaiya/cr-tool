import { Box, Card, CardBody, Flex, VStack } from '@chakra-ui/react';
import { StatusIndicator } from './StatusIndicator';
import { GradientButton } from './common/GradientButton';
import { Image } from '@chakra-ui/react';
import { useTroops, useSpells, useAttackCards, useDefenseCard } from '../contexts/CardContext';
import { useState } from 'react';
import { SelectAttackOverlay } from './SelectAttackOverlay';
import { useEffect } from 'react';
interface AttackCardProps {
  attackCardIndex: number;
}

export const AttackCard = ({ attackCardIndex }: AttackCardProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [attackCards] = useAttackCards();

  const attackCard = attackCards[attackCardIndex];
  const displayCard = attackCard.CardKey;
  const attackNum = attackCard.AttackNumber;
  const type = attackCard.Type;

  const [defenseCard] = useDefenseCard();

  // contextの値の変更を監視
  useEffect(() => {
    // attackCardsの値が変更されたときの処理
    console.log(`AttackCard[${attackCardIndex}]:`, displayCard, attackNum, type, defenseCard);
  }, [attackCardIndex, displayCard, attackNum, type, defenseCard]);

  return (
    <Box w={'full'}>
      {isOverlayOpen && (
        <SelectAttackOverlay
          attackCardIndex={attackCardIndex}
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
        />
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
          {displayCard ? (
            <DisplayStatus
              displayCard={displayCard}
              type={type}
              attackNum={attackNum}
              editOnClick={() => setIsOverlayOpen(true)}
            />
          ) : (
            <Flex direction="column" align="center">
              <GradientButton
                topColor="blue.400"
                bottomColor="blue.500"
                onClick={() => setIsOverlayOpen(true)}
              >
                選択
              </GradientButton>
            </Flex>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

interface DisplayStatusProps {
  displayCard: string;
  type: 'Troop' | 'Spell' | null;
  attackNum: number;
  editOnClick?: () => void;
}

const DisplayStatus = ({ displayCard, type, attackNum, editOnClick }: DisplayStatusProps) => {
  const troops = useTroops();
  const spells = useSpells();

  const damage = type === 'Troop' ? troops[displayCard].Damage : spells[displayCard].Damage;
  const imgSrc = `/resized_cards/${type === 'Troop' ? troops[displayCard].Icon : spells[displayCard].Icon}`;
  const imgAlt = `${type === 'Troop' ? troops[displayCard].JpName : spells[displayCard].JpName}の画像`;
  const totalDamage: number = damage * attackNum;

  return (
    <Flex justify="space-between" fontSize="sm" align="center">
      <Flex align="center">
        <Image src={imgSrc} alt={imgAlt} height="70px" objectFit="cover" />
        <VStack spacing={2} align="left" ml={4}>
          <StatusIndicator label="ダメージ" value={damage} color="blue.500" />
          <StatusIndicator label="攻撃回数" value={attackNum} color="blue.500" />
          <StatusIndicator label="総ダメージ数" value={totalDamage} color="blue.500" />
        </VStack>
      </Flex>
      <GradientButton topColor="blue.400" bottomColor="blue.500" onClick={editOnClick}>
        編集
      </GradientButton>
    </Flex>
  );
};
