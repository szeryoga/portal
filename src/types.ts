export type PortalAppLink = {
  id: string;
  label: string;
  url: string;
};

export type PortalConfig = {
  title: string;
  subtitle: string;
  apps: PortalAppLink[];
};
