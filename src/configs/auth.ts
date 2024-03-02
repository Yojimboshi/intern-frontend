// src\configs\auth.ts
export default {
  meEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/users/current',
  loginEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/users/login',
  adminMeEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/current',
  adminLoginEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
