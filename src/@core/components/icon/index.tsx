// src\@core\components\icon\index.tsx
import { Icon, IconProps } from '@iconify/react'

const IconifyIcon = ({ icon, ...rest }: IconProps) => {
  return <Icon icon={icon} fontSize='1.5rem' {...rest} />
}

export default IconifyIcon
