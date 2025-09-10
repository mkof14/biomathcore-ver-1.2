"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is BioMath Core and how does it work?",
    a: "BioMath Core is the central intelligence of the platform, analyzing your biological data to generate personalized insights.",
  },
  {
    q: "How secure is my data?",
    a: "We use end-to-end encryption and follow strict privacy protocols to ensure your data is protected.",
  },
  {
    q: "How is this different from regular fitness apps and medical tests?",
    a: "BioMath Life combines AI, biometrics, and lifestyle data to offer deeper, more holistic insights.",
  },
  {
    q: "Who can use the platform?",
    a: "Anyone interested in optimizing their health, from beginners to professionals.",
  },
  {
    q: "How do I get started?",
    a: "Sign up, complete your profile, and begin uploading your health data or connect devices.",
  },
  {
    q: "What data do you collect?",
    a: "We collect biometric, lifestyle, and device data to personalize your experience.",
  },
  {
    q: "How often is my data and recommendations updated?",
    a: "Your data is analyzed continuously, and recommendations are refreshed weekly or in real-time depending on your plan.",
  },
  {
    q: "Can I connect other devices or apps?",
    a: "Yes, we support integration with wearables, health apps, and smart devices.",
  },
  {
    q: 'What is the "Critical Health" category?',
    a: "This section is dedicated to vital medical metrics and risks.",
  },
  {
    q: 'What services are available in the "Critical Health" category?',
    a: "Risk analysis, cardiovascular monitoring, emergency recommendations.",
  },
  {
    q: 'What is the "Everyday Wellness" category?',
    a: "Focuses on daily health and habits.",
  },
  {
    q: 'What services are available in the "Everyday Wellness" category?',
    a: "Sleep & Recovery trackers, nutrition trackers, activity recommendations, lifestyle advice.",
  },
  {
    q: 'What is the "Longevity & Anti-Aging & Anti-Aging" category?',
    a: "A section aimed at slowing biological aging.",
  },
  {
    q: 'What services are available in the "Longevity & Anti-Aging & Anti-Aging" category?',
    a: "Biological age analysis, antioxidant recommendations, genetic factors.",
  },
  {
    q: 'What is the "Mental Wellness" category?',
    a: "Mental health, stress, cognitive function.",
  },
  {
    q: 'What services are available in the "Mental Wellness" category?',
    a: "Meditations, cognitive tests, sleep and recovery recommendations.",
  },
  {
    q: 'What is the "Fitness & Performance" category?',
    a: "Physical fitness, training, sports performance.",
  },
  {
    q: 'What services are available in the "Fitness & Performance" category?',
    a: "Training plans, VO2 max analysis, recovery.",
  },
  {
    q: 'What is the "Women\'s Health" category?',
    a: "Specific aspects of women's health.",
  },
  {
    q: 'What services are available in the "Women\'s Health" category?',
    a: "Hormonal balance, menstrual cycle, reproductive health.",
  },
  {
    q: 'What is the "Men\'s Health" category?',
    a: "Specific aspects of men's health.",
  },
  {
    q: 'What services are available in the "Men\'s Health" category?',
    a: "Testosterone analysis, cardiovascular risks, sexual health.",
  },
  {
    q: 'What is the "Beauty & Skincare & Skincare" category?',
    a: "Skin, appearance, aging biomarkers.",
  },
  {
    q: 'What services are available in the "Beauty & Skincare & Skincare" category?',
    a: "Skin condition analysis, care recommendations, nutraceuticals.",
  },
  {
    q: 'What is the "Nutrition & Diet & Diet" category?',
    a: "Nutrition & Diet, nutrients, metabolism.",
  },
  {
    q: 'What services are available in the "Nutrition & Diet & Diet" category?',
    a: "Personalized nutrition plans, micronutrient analysis.",
  },
  {
    q: 'What is the "Sleep & Recovery & Recovery" category?',
    a: "Sleep & Recovery, recovery, circadian rhythms.",
  },
  {
    q: 'What services are available in the "Sleep & Recovery & Recovery" category?',
    a: "Sleep & Recovery trackers, recommendations for improving sleep quality.",
  },
  {
    q: 'What is the "Environmental Health Health" category?',
    a: "Impact of the environment on health.",
  },
  {
    q: 'What services are available in the "Environmental Health Health" category?',
    a: "Pollution analysis, protection recommendations.",
  },
  {
    q: 'What is the "Family Health" category?',
    a: "Family health, children, elderly care.",
  },
  {
    q: 'What services are available in the "Family Health" category?',
    a: "Family member profiles, shared recommendations.",
  },
  {
    q: 'What is the "Preventive Medicine & Longevity" category?',
    a: "Disease prevention and life extension.",
  },
  {
    q: 'What services are available in the "Preventive Medicine & Longevity" category?',
    a: "Screenings, genetic tests, biomarkers.",
  },
  {
    q: 'What is the "Biohacking & Performance" category?',
    a: "Enhancing body functions through technology.",
  },
  {
    q: 'What services are available in the "Biohacking & Performance" category?',
    a: "Nutraceuticals, trackers, neurostimulation.",
  },
  { q: 'What is the "Senior Care" category?', a: "Care for the elderly." },
  {
    q: 'What services are available in the "Senior Care" category?',
    a: "Monitoring, safety and longevity recommendations.",
  },
  {
    q: 'What is the "Eye-Health Suite" category?',
    a: "Vision and eye health.",
  },
  {
    q: 'What services are available in the "Eye-Health Suite" category?',
    a: "Vision tests, eye protection recommendations.",
  },
  {
    q: 'What is the "General Sexual Longevity & Anti-Aging" category?',
    a: "Sexual health and longevity.",
  },
  {
    q: 'What services are available in the "General Sexual Longevity & Anti-Aging" category?',
    a: "Hormonal analysis, improvement recommendations.",
  },
  {
    q: 'What is the "Men\'s General Sexual Longevity & Anti-Aging" category?',
    a: "Specific aspects of male sexuality.",
  },
  {
    q: 'What services are available in the "Men\'s General Sexual Longevity & Anti-Aging" category?',
    a: "Testosterone analysis, erectile function.",
  },
  {
    q: 'What is the "Women\'s General Sexual Longevity & Anti-Aging" category?',
    a: "Specific aspects of female sexuality.",
  },
  {
    q: 'What services are available in the "Women\'s General Sexual Longevity & Anti-Aging" category?',
    a: "Hormonal balance, libido, reproductive health.",
  },
  {
    q: 'What is the "Digital Therapeutics Store" category?',
    a: "Digital therapeutic solutions.",
  },
  {
    q: 'What services are available in the "Digital Therapeutics Store" category?',
    a: "Apps, programs, AI tools for health.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-800 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none"
              >
                <span className="text-sm text-purple-300">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-purple-400 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`px-4 pb-4 text-sm text-gray-400 ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
