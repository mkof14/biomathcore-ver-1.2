"use client";
import "../forms.css";
import React from "react";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FormRenderer from "@/components/forms/FormRenderer";

export default function FormPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);

  return (
    <div className="forms-root px-4 py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-end">
          <LanguageSwitcher />
        </div>
        <FormRenderer slug={slug} />
      </div>
    </div>
  );
}
