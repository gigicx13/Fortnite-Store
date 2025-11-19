import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const response = await fetch("https://fortnite-api.com/v2/shop");
    const json = await response.json();

    const entries = json?.data?.entries;

    if (!Array.isArray(entries)) {
      return NextResponse.json({
        error: "Formato inesperado vindo da API externa",
        debug: json.data
      }, { status: 500 });
    }

    // Limpa a loja antiga
    await prisma.cosmetic.updateMany({
      data: { isInShop: false }
    });

    let updatedCount = 0;

    // Agora processa entries.brItems
    for (const entry of entries) {
      const brItems = entry.brItems ?? [];

      for (const item of brItems) {
        const updated = await prisma.cosmetic.updateMany({
          where: { externalId: item.id },
          data: {
            isInShop: true,
            isNew: false,
            price: entry.finalPrice ?? entry.regularPrice ?? 0,
            name: item.name,
            type: item.type?.value,
            rarity: item.rarity?.value,
            image: item.images?.icon
          }
        });

        if (updated.count > 0) updatedCount++;
      }
    }

    return NextResponse.json({
      message: "Loja atualizada com sucesso!",
      totalItemsUpdated: updatedCount
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Erro ao sincronizar a loja",
      details: error.message
    }, { status: 500 });
  }
}
