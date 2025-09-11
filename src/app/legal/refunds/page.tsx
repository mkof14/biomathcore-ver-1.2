export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import LegalNote from "@/components/legal/LegalNote";
export default function Refunds() { return ( <main className="mx-auto max-w-3xl px-6 py-12 dark: text-gray-900 dark:text-gray-100 leading-relaxed legal-content not- not-prose"> <h1>Refund & Cancellation Policy</h1> <p><strong>Last updated:</strong> 2025-09-06</p> <h2>Subscriptions</h2> <ul> <li>Plans renew automatically until canceled.</li> <li>Cancel anytime to stop future charges; access continues through the paid period.</li> <li>We may offer prorated or discretionary refunds where required by law or stated in promotions.</li> </ul> <h2>Trials & Promotions</h2> <p>Trial cancellations must occur before renewal to avoid charges.</p> <h2>How to Cancel</h2> <p>In-app under <em>Account → Billing</em> or email <a href="mailto:billing@biomathcore.com">billing@biomathcore.com</a>.</p> <p className="mt-8 text-xs text-gray-900">Important Note: BioMath Core is not a medical service and does not provide medical advice. Always consult with a qualified healthcare professional for any health concerns or conditions.</p> <LegalNote />
</main> );
}
