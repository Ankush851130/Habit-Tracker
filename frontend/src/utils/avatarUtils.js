export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '';
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://') || avatarPath.startsWith('data:')) {
    return avatarPath;
  }
  // In development/production, if relative path /uploads/... attach server host if needed
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  return `${serverUrl}${avatarPath}`;
};
