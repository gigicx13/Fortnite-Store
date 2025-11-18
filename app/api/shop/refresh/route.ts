import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Busca a loja diária da API externa
    const response = await fetch("https://fortnite-api.com/v2/shop/br/combined");
    const data = await response.json();

    if (!data || !data.data) {
      return NextResponse.json({ error: "Erro ao obter loja externa" }, { status: 500 });
    }

    const shopEntries = [
      ...(data.data.featured?.entries || []),
      ...(data.data.daily?.entries || []),
    ];

    // Limpar loja antiga
    await prisma.cosmetic.updateMany({
      data: { isInShop: false }
    });

    let count = 0;

    for (const entry of shopEntries) {
      for (const item of entry.items || []) {
        await prisma.cosmetic.updateMany({
          where: { externalId: item.id },
          data: {
            isInShop: true,
            isNew: item.new === true
          }
        });

        count++;
      }
    }

    return NextResponse.json({
      message: "Loja atualizada com sucesso!",
      total: count
    });

  } catch (error) {
    console.error("Erro ao atualizar loja:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar loja" },
      { status: 500 }
    );
  }
}
