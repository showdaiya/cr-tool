import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  useDisclosure,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { InfoIcon, RepeatIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef, useCallback } from "react";
import DefenceCard from "./DefenceCard";
import AttackCardSection from "./AttackCardSection";
import SelectCardOverlay from "./SelectCardOverlay";
import DefenseNotification from "./DefenseNotification";
import { useCardContext } from "@/context/CardContext";
import { AnyCard } from "@/types/CardTypes";

// --- Internal Components ---

const PageHeader = () => (
  <Box
    bgGradient="linear(to-r, blue.500, purple.600)"
    p={4} // Reduced padding
    borderRadius="lg"
    shadow="md"
    textAlign="center" // Center align text within the box
    opacity={0.5}
    //_hover={{ opacity: 1 }}
  >
    <Heading
      as="h1"
      size="lg"
      color="white"
      lineHeight="1.2"
      opacity={0.9}
    >
      {" "}
      {/* Reduced size, adjusted line height */}
      クラロワ
      <br />
      ダメージシミュレーター {/* Added line break */}
    </Heading>
  </Box>
);

type ActionButtonsProps = {
  onToggleInfo: () => void;
  onReset: () => void;
};

const ActionButtons = ({ onToggleInfo, onReset }: ActionButtonsProps) => (
  <HStack spacing={4} justifyContent="center">
    <Button
      leftIcon={<InfoIcon />}
      colorScheme="blue" // Changed color scheme for visibility
      variant="ghost"
      size="sm"
      onClick={onToggleInfo}
    >
      ヘルプ
    </Button>
    <Button
      leftIcon={<RepeatIcon />}
      size="sm"
      colorScheme="red" // Changed color scheme for visibility
      variant="outline" // Changed variant for visibility
      onClick={onReset}
    >
      リセット
    </Button>
  </HStack>
);

const InfoBox = () => (
  <Box
    p={2}
    borderWidth="1px"
    borderRadius="lg"
    bg="bg.footer"
    borderColor="border.default"
    fontSize="xs"
  >
    <Text>
      <strong>使い方:</strong>{" "}
      防衛カードを選択し、攻撃カードを追加してダメージ計算を行います。
      計算結果は、防衛カードの残りHPとして表示されます。
    </Text>
  </Box>
);

const PageFooter = () => (
  <Box
    as="footer"
    py={6}
    bg="bg.footer"
    borderTop="1px"
    borderColor="border.default"
  >
    <Container maxW="container.sm">
      <VStack spacing={2}>
        <Text fontSize="xs" textAlign="center" color="text.secondary">
          © 2024-2025 クラロワ ダメージシミュレーター
        </Text>
        <Text fontSize="2xs" textAlign="center" color="text.muted">
          カードデータ出典:{" "}
          <Text
            as="a"
            href="https://clashroyale.fandom.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.500"
            textDecoration="underline"
          >
            Clash Royale Wiki (Fandom)
          </Text>{" "}
          - CC-BY-SA 3.0
        </Text>
        <Text fontSize="2xs" textAlign="center" color="text.muted">
          ※ 本ツールはファン作成の非公式ツールです。Supercellとは一切関係ありません。
        </Text>
      </VStack>
    </Container>
  </Box>
);


// --- Main Component ---

const CardBattlePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { defenceCard, resetState, setDefenceCard } = useCardContext(); // Get setDefenceCard
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDefenseCardVisible, setIsDefenseCardVisible] = useState(true);
  const defenseCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 可視性の変更を処理するコールバック関数
  const handleVisibilityChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]) {
        // console.log("IntersectionObserver Callback:", entries[0].isIntersecting); // Keep commented for now
        setIsDefenseCardVisible(entries[0].isIntersecting);
      }
    },
    [],
  );

  // マウント時に実行
  useEffect(() => {
    setMounted(true);
  }, []);

  // IntersectionObserverの設定（マウント・アンマウント時のみ）
  useEffect(() => {
    // マウントされ、refが利用可能な場合のみObserverを設定・監視開始
    if (mounted && defenseCardRef.current) {
      // console.log("Setting up IntersectionObserver"); // Keep commented for now
      const currentElement = defenseCardRef.current; // Capture ref value

      // 既存のObserverがあれば切断
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(handleVisibilityChange, {
        root: null,
        threshold: 0.5,
      });

      // console.log("Observing element:", currentElement); // Keep commented for now
      observerRef.current.observe(currentElement);

      // このeffectインスタンスに対応するクリーンアップ
      const currentObserver = observerRef.current;
      return () => {
        // console.log("Cleaning up specific IntersectionObserver"); // Keep commented for now
        if (currentObserver) {
          currentObserver.disconnect();
        }
      };
    }

    // マウント前、またはrefがまだ利用できない場合は何もしない
    // コンポーネントのアンマウント時の全体的なクリーンアップ
    return () => {
      if (observerRef.current) {
        // console.log("General Cleanup: Disconnecting observer on unmount"); // Keep commented for now
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [mounted, handleVisibilityChange]); // mounted を依存配列に追加

  const resetCalculation = () => {
    resetState(); // Call the reset function from context
  };

  if (!mounted) {
    return null;
  }

  // 通知を表示する条件: (元に戻す)
  // 1. 防衛カードセクションが画面に表示されていない、または
  // 2. 防衛カードが選択されていない
  const shouldShowNotification = !isDefenseCardVisible || !defenceCard;
  // console.log("Render - isDefenseCardVisible:", isDefenseCardVisible, "shouldShowNotification:", shouldShowNotification, "defenceCard:", !!defenceCard); // Keep commented for now

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* 防衛カードの通知 */}
      {shouldShowNotification && (
        <DefenseNotification onSelectDefenseCard={onOpen} />
      )}

      <Container maxW="container.sm" py={4} px={4} flex="1">
        <Stack spacing={6}>
          {/* Header Section */}
          <PageHeader />

          {/* Buttons Section */}
          <ActionButtons
            onToggleInfo={() => setShowInfo(!showInfo)}
            onReset={resetCalculation}
          />

          {showInfo && <InfoBox />}

          <Stack spacing={6}>
            <Box id="defense-card-section" ref={defenseCardRef}>
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                防衛カード
              </Text>
              <DefenceCard onSelectClick={onOpen} />
            </Box>

            <Box>
              <AttackCardSection />
            </Box>
          </Stack>
        </Stack>

        <SelectCardOverlay
          isOpen={isOpen}
          onClose={onClose}
          modalTitle="防衛カードを選択"
          cardFilter={(card) => card.defence === true} // Filter for defence cards
          allowedCardTypes={["Troop", "Building"]} // Defence cards are Troops or Buildings
          onConfirm={(selected) => {
            // Type guard to ensure selected is AnyCard (not AttackCardState)
            if ('cardId' in selected && 'attackNumbers' in selected) {
              // This case should not happen for defence selection, but handle defensively
              console.error("Unexpected AttackCardState received for defence selection.");
            } else {
              setDefenceCard(selected as AnyCard); // Cast is safe here due to filter/logic
            }
          }}
          initialSelectedCard={defenceCard} // Pass current defence card
        />
      </Container>

      <PageFooter />
    </Box>
  );
};

export default CardBattlePage;
