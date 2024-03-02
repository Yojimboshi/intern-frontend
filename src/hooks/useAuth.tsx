// src\hooks\useAuth.tsx
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

export const useAuth = () => useContext(AuthContext)
