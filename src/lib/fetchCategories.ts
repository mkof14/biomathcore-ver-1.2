import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((doc) => doc.data());
};
