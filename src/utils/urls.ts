const routes = {
  Landing: '/',
  Access: '/access',
  Dashboard: '/dashboard',
  CheckIn: '/checkin',
  Status: '/status',
  Settings: '/settings',
  Analytics: '/analytics',
  Pricing: '/pricing'
};

export type RouteKey = keyof typeof routes;

export function createPageUrl(page: RouteKey): string {
  return routes[page] || '/';
}
