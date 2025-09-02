export type ProviderKey = "apple" | "oura" | "fitbit" | "garmin";

export type Provider = {
  key: ProviderKey;
  name: string;
  brand?: string;
  description?: string;
  connected: boolean;
  docs?: string;
};

export const PROVIDERS: Provider[] = [
  {
    key: "apple",
    name: "Apple Health",
    brand: "Apple",
    description: "Sync steps, heart rate, sleep and more from Health app.",
    connected: true,
    docs: "https://support.apple.com/guide/iphone/track-your-health-iph4d0e53a5/ios",
  },
  {
    key: "oura",
    name: "Oura Ring",
    brand: "Oura",
    description: "Precision sleep, HRV and readiness data from your ring.",
    connected: false,
    docs: "https://support.ouraring.com/",
  },
  {
    key: "fitbit",
    name: "Fitbit",
    brand: "Google",
    description: "Daily activity, heart rate and sleep stages.",
    connected: false,
    docs: "https://support.google.com/fitbit",
  },
  {
    key: "garmin",
    name: "Garmin",
    brand: "Garmin",
    description: "Endurance metrics, HR, VO₂ est. and workout uploads.",
    connected: true,
    docs: "https://support.garmin.com/",
  },
];
