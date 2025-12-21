import { AddIcon } from '@chakra-ui/icons';
import { Button, VStack, Heading, Flex, Stack } from '@chakra-ui/react';
import { GradientButton } from './common/GradientButton';
import { AttackCard } from './AttackCard';
import { useAttackCards } from '../contexts/CardContext';
import { useAttackLastIndex } from '../contexts/CardContext';

export const AttackCardSection = () => {
  const [attackCards, setAttackCards] = useAttackCards();
  const [attackLastIndex, setAttackLastIndex] = useAttackLastIndex();

  const handleAddClick = () => {
    const newIndex = attackLastIndex + 1;
    setAttackLastIndex(newIndex);
    setAttackCards({ ...attackCards, [newIndex]: { CardKey: null, AttackNumber: 1, Type: null } });
  };

  return (
    <Stack w="full" spacing={3}>
      <Flex justify="space-between" align="center" height={10}>
        <Heading size="md">攻撃側</Heading>
        <GradientButton topColor="green.400" bottomColor="green.500">
          追加
        </GradientButton>
      </Flex>
      <VStack spacing={3} w="full">
        {Object.keys(attackCards).map(key => (
          <AttackCard key={Number(key)} attackCardIndex={Number(key)} />
        ))}
        <Button
          variant="outline"
          w="full"
          h="12"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="red.200"
          _focus={{ outline: 'none' }}
          _hover={{}}
          _active={{}}
          onClick={handleAddClick}
        >
          <AddIcon color="red.500" />
        </Button>
      </VStack>
    </Stack>
  );
};
