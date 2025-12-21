import { Button, ButtonProps } from '@chakra-ui/react'

interface GradientButtonProps extends ButtonProps {
  topColor?: string
  bottomColor?: string
}

export const GradientButton = ({
  topColor = 'blue.400',
  bottomColor = 'blue.500',
  children,
  ...props
}: GradientButtonProps) => {
  return (
    <Button
      size="md"
      w={"70px"}
      color={'white'}
      boxShadow={'md'}
      bgGradient={`linear(to-b, ${topColor} 50%, ${bottomColor} 50%)`}
      _hover={{ transform: 'scale(0.98)' }}
      _active={{ transform: 'scale(0.95)' }}
      {...props}
    >
      {children}
    </Button>
  )
}
