export function hasPermissions(granted: string[], required: string[]): boolean {
  if (granted.includes('platform.admin')) return true;
  return required.every((permission) => granted.includes(permission));
}

export function canAccessSite(siteIds: string[], siteId: string, permissions: string[]): boolean {
  return permissions.includes('platform.admin') || siteIds.includes(siteId);
}
