import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold">
          Home
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/services" className="text-white">
              Services
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white">
              About
            </Link>
          </li>
          <li>
            <Link href="/member" className="text-white">
              Member
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
