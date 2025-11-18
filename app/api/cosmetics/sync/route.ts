import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // API pública de Fortnite
    const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
    const data = await response.json();

    const items = data.data;

    let count = 0;

    for (const item of items) {
      await prisma.cosmetic.upsert({
        where: { externalId: item.id },
        update: {
          name: item.name,
          type: item.type.value,
          rarity: item.rarity?.value ?? "common",
          image: item.images?.icon,
          isNew: item.new === true,
          price: 500, // preço padrão (podemos ajustar depois)
        },
        create: {
          externalId: item.id,
          name: item.name,
          type: item.type.value,
          rarity: item.rarity?.value ?? "common",
          image: item.images?.icon,
          isNew: item.new === true,
          price: 500,
        },
      });

      count++;
    }

    return NextResponse.json({
      message: "Sincronização concluída!",
      total: count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao sincronizar" }, { status: 500 });
  }
}
