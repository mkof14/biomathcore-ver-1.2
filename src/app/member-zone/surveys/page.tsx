"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Questionnaire } from '@prisma/client';

export default function SurveysPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestionnaires() {
      try {
        const response = await fetch('/api/questionnaires');
        if (!response.ok) {
          throw new Error('Failed to fetch questionnaires');
        }
        const data = await response.json();
        setQuestionnaires(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestionnaires();
  }, []);

  const groupedByCategory = questionnaires.reduce((acc, q) => {
    const category = q.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(q);
    return acc;
  }, {} as Record<string, Questionnaire[]>);


  if (loading) {
    return <div className="p-8 text-center">Loading surveys...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Available Surveys</h1>

      {Object.keys(groupedByCategory).length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No surveys available at the moment.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).map(([category, qs]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qs.map((q) => (
                  <Link href={`/member-zone/surveys/${q.slug}`} key={q.id}>
                    <div className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                      <h3 className="text-xl font-bold text-violet-700 dark:text-violet-400 mb-2">{q.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{q.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
