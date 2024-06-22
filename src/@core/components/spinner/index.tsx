// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { keyframes } from '@mui/system'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Box
        component="img"
        src="/images/logo.png"
        alt="Logo"
        sx={{
          width: 80,
          height: 80,
          animation: `${spin} 2s linear infinite`,
        }}
      />
    </Box>
  )
}

export default FallbackSpinner
