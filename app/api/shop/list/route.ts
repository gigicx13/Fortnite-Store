import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.cosmetic.findMany({
      where: { isInShop: true }
    });

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    return new Response(JSON.stringify({ error: "Erro ao listar itens" }), {
      status: 500
    });
  }
}
