import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <div className="hex-item">
      <div className="hexagon">
        <div className="hexagon-in1">
          <div className="hexagon-in2">
            <Link href={`/categories/${category.catSlug}`}>
              <div className="flex items-center justify-center h-full flex-col">
                <div className="hex-icon">{category.icon}</div>
                <h3 className="hex-title">{category.name}</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
