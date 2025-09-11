/** Demo guard: всегда «разрешено» */
export async function requireActiveSubscription(_userId?: string) {
  return { ok: true, plan: { id: "demo_pro", price: 2900, interval: "month" } };
}
/** некоторые маршруты ожидают 'requireActive' */
export const requireActive = requireActiveSubscription;
export default {};
