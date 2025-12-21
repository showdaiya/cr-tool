import { ChangeEvent, FC, memo, useState } from 'react';
import { useTroops, useDefenseCard } from '../contexts/CardContext';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Select,
  ModalBody,
  ModalHeader,
  chakra,
} from '@chakra-ui/react';

interface SelectDefenceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelectDefenceOverlay: FC<SelectDefenceOverlayProps> = memo(({ isOpen, onClose }) => {
  const troopData = useTroops();
  const [defenseCard, setDefenseCard] = useDefenseCard();
  const [selectCard, setSelectCard] = useState<string>(defenseCard);

  const handleOnClose = () => {
    setDefenseCard(selectCard);
    onClose();
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const cardKey = event.target.value;
    console.log('Selected Card Key:', cardKey);
    setSelectCard(cardKey);
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
            width: "100%"
          }
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
          <Select // モバイル環境指定時のプルダウンリストの横幅がどうしてもおかしい。
            defaultValue={defenseCard}
            size="lg"
            w="full"
            maxH="50vh"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
            variant="outline"
            sx={{
              width: "100%",
              '& > option': {
                width: ["100vw", "100%"], // モバイル用に明示的なビューポート幅を指定
                maxWidth: ["100vw", "100%"], // 最大幅も同様に指定
                transform: ["translateX(-50%)", "none"], // モバイルでの位置調整
                left: ["50%", "auto"], // モバイルでの位置調整
                position: ["relative", "static"]
              }
            }}
            onChange={handleSelectChange}
            overflowY="auto" // 追加
          >
            {Object.entries(troopData).map(([cardKey, card]) => (
              <chakra.option key={cardKey} value={cardKey}>
                {card.JpName}
              </chakra.option>
            ))}
          </Select>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

SelectDefenceOverlay.displayName = 'SelectDefenceOverlay';
