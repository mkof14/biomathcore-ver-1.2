'use client';

import { useParams } from "next/navigation";
import { categoriesData, servicesData } from "@/data/servicesData";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const category = categoriesData.find((c) => c.catSlug === categorySlug);
  const categoryServices = servicesData.filter(
    (s) => s.category === category?.name,
  );

  if (!category)
    return (
      <div className="container mx-auto py-10 text-center">
        Category not found
      </div>
    );

  return (
    <div className="container mx-auto py-10">
      <h1 className="corporate-heading text-3xl mb-6">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryServices.map((service) => (
          <div
            key={service.id}
            className="bg-gray-800 p-4 rounded-lg text-white"
          >
            <h3 className="text-xl font-bold">{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
