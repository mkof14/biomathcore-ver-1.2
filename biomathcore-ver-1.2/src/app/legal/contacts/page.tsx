import LegalNote from "@/components/legal/LegalNote";
export default function ContactsPage() { return ( <main className="mx-auto max-w-3xl px-6 py-12 space-y-6 text-gray-900 dark:text-gray-100 leading-relaxed legal-content not- not-prose"> <h1 className="text-3xl font-bold">Contact</h1> <p>For support or inquiries: support@biomathcore.com</p> <p className="mt-8 text-xs text-gray-900">Important Note: BioMath Core is not a medical service and does not provide medical advice. Always consult with a qualified healthcare professional for any health concerns or conditions.</p> <LegalNote />
</main> );
}
