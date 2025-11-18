import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const type = searchParams.get("type");
    const rarity = searchParams.get("rarity");

    const items = await prisma.cosmetic.findMany({
      where: {
        isInShop: true,
        AND: [
          name ? { name: { contains: name, mode: "insensitive" } } : {},
          type ? { type } : {},
          rarity ? { rarity } : {},
        ],
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao buscar itens da loja:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens da loja" },
      { status: 500 }
    );
  }
}
