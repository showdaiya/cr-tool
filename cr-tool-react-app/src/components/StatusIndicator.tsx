import { Circle, Flex, Text } from '@chakra-ui/react';

interface StatusIndicatorProps {
  label: string;
  value: number;
  color?: string;
  textColor?: string;
}

export const StatusIndicator = ({
  label,
  value,
  color = "green.500",
  textColor = "inherit"
}: StatusIndicatorProps) => {
  return (
    <Flex align="center">
      <Circle size="2" bg={color} mr={2} />
      <Text fontSize={"md"} color={textColor}>{label}: {value}</Text>
    </Flex>
  );
};
