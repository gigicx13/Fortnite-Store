import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { cosmeticId } = await req.json();

    if (!cosmeticId) {
      return new Response(JSON.stringify({ error: "CosmeticId é obrigatório" }), {
        status: 400,
      });
    }

    // Lê cookies corretamente (Next 14+)
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
      });
    }

    // Valida token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 404,
      });
    }

    // Busca item da loja
    const item = await prisma.cosmetic.findUnique({
      where: { id: cosmeticId },
    });

    if (!item || !item.isInShop) {
      return new Response(JSON.stringify({ error: "Item não está à venda" }), {
        status: 400,
      });
    }

    // Verifica saldo
    if (user.vbucks < item.price) {
      return new Response(JSON.stringify({ error: "Saldo insuficiente" }), {
        status: 400,
      });
    }

    // Debita V-Bucks
    await prisma.user.update({
      where: { id: user.id },
      data: { vbucks: user.vbucks - item.price },
    });

    // Registra compra
    await prisma.purchase.create({
      data: {
        userId: user.id,
        cosmeticId: item.id,
      },
    });

    return new Response(JSON.stringify({ message: "Compra realizada com sucesso!" }), {
      status: 200,
    });

  } catch (err: any) {
    console.error("Erro ao comprar item:", err);
    return new Response(JSON.stringify({ error: "Erro interno", details: err.message }), {
      status: 500,
    });
  }
}
