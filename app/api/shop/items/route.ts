import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // filtros opcionais
    const name = searchParams.get("name") ?? undefined;
    const type = searchParams.get("type") ?? undefined;
    const rarity = searchParams.get("rarity") ?? undefined;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
    const skip = (Math.max(page, 1) - 1) * limit;

    // Monta a condição where com tolerância a filtros vazios
    const where: any = {
      isInShop: true,
      AND: [],
    };

    if (name) where.AND.push({ name: { contains: name, mode: "insensitive" } });
    if (type) where.AND.push({ type });
    if (rarity) where.AND.push({ rarity });

    // Se não houver filtros na array AND, remove-a para evitar objetos vazios
    if (where.AND.length === 0) delete where.AND;

    const [items, total] = await Promise.all([
      prisma.cosmetic.findMany({
        where,
        orderBy: [{ rarity: "desc" }, { name: "asc" }],
        skip,
        take: limit,
        select: {
          id: true,
          externalId: true,
          name: true,
          type: true,
          rarity: true,
          price: true,
          image: true,
          isNew: true,
          isInShop: true,
          updatedAt: true,
        },
      }),
      prisma.cosmetic.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      items,
    });
  } catch (error) {
    console.error("Erro ao buscar itens da loja:", error);
    return NextResponse.json({ error: "Erro ao buscar itens da loja" }, { status: 500 });
  }
}
