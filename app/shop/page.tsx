"use client";

import { useEffect, useState } from "react";

type Cosmetic = {
  id: number;
  name: string;
  price: number;
  rarity: string;
  image: string | null;
  type: string;
  isNew: boolean;
};

export default function ShopPage() {
  const [items, setItems] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/shop/items");
      const data = await res.json();
      setItems(data.items);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Carregando loja…
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Loja do Fortnite</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <img
              src={item.image ?? "/placeholder.png"}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />

            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-400 capitalize">
              {item.type} • {item.rarity}
            </p>

            <p className="text-yellow-300 font-bold mt-2">
              {item.price} V-Bucks
            </p>

            {item.isNew && (
              <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-2">
                Novo!
              </span>
            )}

            <button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white font-bold"
              onClick={() => alert(`Comprar item ${item.name} (ID: ${item.id})`)}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
