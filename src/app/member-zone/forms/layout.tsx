import "./forms.css";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Ничего «клиентского» тут не делаем, только оборачиваем.
  return <>{children}</>;
}
