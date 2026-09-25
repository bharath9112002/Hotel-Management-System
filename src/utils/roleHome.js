export function getHomeRoute(user) {
  return user?.role === 'Admin' ? '/dashboard' : '/rooms'
}
