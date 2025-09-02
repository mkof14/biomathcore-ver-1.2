"use client";
/**
 * Lightweight subscription status banner for Member Zone.
 * - status:
 *    'active'      -> green banner with next renewal/end date
 *    'canceled'    -> yellow warning
 *    'incomplete'  -> red error (payment issue)
 *    'none'        -> blue info (free plan)
 */
interface SubscriptionStatusBannerProps {
  status: "active" | "canceled" | "incomplete" | "none";
  currentPeriodEnd?: string; // ISO date string
}

export default function SubscriptionStatusBanner({
  status,
  currentPeriodEnd,
}: SubscriptionStatusBannerProps) {
  let message = "";
  let classes = "rounded-lg p-4 mb-4 text-sm md:text-base font-medium ";

  switch (status) {
    case "active":
      message = `Your subscription is active${
        currentPeriodEnd
          ? ` until ${new Date(currentPeriodEnd).toLocaleDateString()}`
          : ""
      }.`;
      classes +=
        "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200";
      break;
    case "canceled":
      message = "Your subscription has been canceled.";
      classes +=
        "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200";
      break;
    case "incomplete":
      message = "Payment is incomplete. Please update your payment method.";
      classes += "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200";
      break;
    case "none":
    default:
      message = "You are on the free plan. Upgrade to unlock all features.";
      classes += "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200";
      break;
  }

  return <div className={classes}>{message}</div>;
}
