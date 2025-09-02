"use client";
import { useState } from "react";

export default function SurveyForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    healthGoals: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey Data:", formData);
    setSubmitted(true);
   
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="corporate-heading text-2xl mb-4">Health Survey</h2>
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg text-white"
        >
          <div className="mb-4">
            <label className="block mb-2">Возраст</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="w-full p-2 rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Пол</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full p-2 rounded text-black"
              required
            >
              <option value="">Выберите</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Цели здоровья</label>
            <textarea
              value={formData.healthGoals}
              onChange={(e) =>
                setFormData({ ...formData, healthGoals: e.target.value })
              }
              className="w-full p-2 rounded text-black"
              placeholder="Введите ваши цели..."
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Отправить
          </button>
        </form>
      ) : (
        <p className="text-center text-green-500">
          Спасибо! Ваши данные отправлены.
        </p>
      )}
    </div>
  );
}
