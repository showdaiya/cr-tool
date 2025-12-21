import { ChangeEvent, FC, memo } from 'react';
import { useTroops, useSpells, useAttackCards } from '../contexts/CardContext';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Select,
  ModalBody,
  ModalHeader,
  chakra,
  Card,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface SelectAttackOverlayProps {
  attackCardIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const SelectAttackOverlay: FC<SelectAttackOverlayProps> = memo(
  ({ attackCardIndex, isOpen, onClose }) => {
    const troopData = useTroops();
    const spellData = useSpells();
    const [attackCards, setAttackCards] = useAttackCards();

    const attackCard = attackCards[attackCardIndex];
    const displayCardKey = attackCard.CardKey ? attackCard.CardKey : 'Knight';
    const attackNum = attackCard.AttackNumber;
    const type = attackCard.Type ? attackCard.Type : 'Troop';

    const [inputCardKey, setInputCardKey] = useState(displayCardKey);
    const [inputType, setInputType] = useState<'Troop' | 'Spell' | null>(type);
    const [inputAttackNum, setInputAttackNum] = useState(attackNum);

    const selectList = Object.entries({ ...troopData, ...spellData }).map(([cardKey, card]) => (
      <chakra.option key={cardKey} value={cardKey} data-type={card.Type}>
        {card.JpName}
      </chakra.option>
    ));

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectCardKey = event.target.value;
      const getSelectType = event.target.selectedOptions[0].dataset.type;
      const selectType =
        getSelectType === 'Troop' || getSelectType === 'Spell' ? getSelectType : null;
      console.log('Selected Card Key:', selectCardKey, getSelectType);

      setInputCardKey(selectCardKey);
      setInputType(selectType);
    };

    const handleOnClose = () => {
      setAttackCards(prev => ({
        ...prev,
        [attackCardIndex]: {
          CardKey: inputCardKey,
          Type: inputType,
          AttackNumber: inputAttackNum,
        }
      }));

      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={handleOnClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          w={['90%', '80%']}
          h={['70vh', '70vh']}
          maxW="1000px"
          sx={{
            '& select': {
              width: '100%',
            },
          }}
          bg="white"
          borderRadius="md"
          boxShadow="xl"
          position="relative" // 追加
          overflow="hidden" // 追加
        >
          <ModalHeader />
          <ModalCloseButton size="lg" zIndex={2} />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={6}
            overflow="hidden" // 追加
          >
            <VStack spacing={6} w="full">
              <Select // モバイル環境指定時のプルダウンリストの横幅がどうしてもおかしい。
                defaultValue={displayCardKey}
                size="lg"
                w="full"
                maxH="50vh"
                borderColor="gray.300"
                _hover={{ borderColor: 'gray.400' }}
                variant="outline"
                sx={{
                  width: '100%',
                  '& > option': {
                    width: ['100vw', '100%'], // モバイル用に明示的なビューポート幅を指定
                    maxWidth: ['100vw', '100%'], // 最大幅も同様に指定
                    transform: ['translateX(-50%)', 'none'], // モバイルでの位置調整
                    left: ['50%', 'auto'], // モバイルでの位置調整
                    position: ['relative', 'static'],
                  },
                }}
                onChange={handleSelectChange}
                overflowY="auto" // 追加
              >
                {selectList}
              </Select>

              <Card mt={4} p={4} display="flex" alignItems="center" justifyContent="center" gap={2}>
                <HStack>
                  <chakra.button
                    onClick={() => setInputAttackNum(inputAttackNum - 1)}
                    p={2}
                    bg="gray.100"
                    _hover={{ bg: 'gray.200' }}
                    borderRadius="md"
                  >
                    ◀
                  </chakra.button>

                  <chakra.input
                    type="number"
                    value={inputAttackNum}
                    min={0}
                    max={1000}
                    onChange={e => {
                      const newValue = parseInt(e.target.value);
                      if (newValue <= 0) {
                        setInputAttackNum(0);
                      } else if (newValue > 100) {
                        setInputAttackNum(100);
                      }
                    }}
                    textAlign="center"
                    w="80px"
                    p={2}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.300"
                  />

                  <chakra.button
                    onClick={() => setInputAttackNum(inputAttackNum + 1)}
                    p={2}
                    bg="gray.100"
                    _hover={{ bg: 'gray.200' }}
                    borderRadius="md"
                  >
                    ▶
                  </chakra.button>
                </HStack>
              </Card>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

SelectAttackOverlay.displayName = 'SelectAttackOverlay';
