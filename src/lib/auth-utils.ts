export function getAuthToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
}

export function getUserId(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('id='))?.split('=')[1] || '';
}
