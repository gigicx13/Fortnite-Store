import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { cosmeticId } = await req.json();

    if (!cosmeticId) {
      return new Response(
        JSON.stringify({ error: "cosmeticId é obrigatório" }),
        { status: 400 }
      );
    }

    // 🔥 LÊ O TOKEN PELO HEADER (para Thunder Client)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token não enviado" }),
        { status: 401 }
      );
    }

    // 🔒 VALIDA O TOKEN JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 401 }
      );
    }

    // 🔍 BUSCA O USUÁRIO PELO ID DO TOKEN
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404 }
      );
    }

    // 🔍 BUSCA O ITEM
    const item = await prisma.cosmetic.findUnique({
      where: { id: cosmeticId },
    });

    if (!item || !item.isInShop) {
      return new Response(
        JSON.stringify({ error: "Item não está à venda" }),
        { status: 400 }
      );
    }

    // 💰 VERIFICA SALDO
    if (user.vbucks < item.price) {
      return new Response(
        JSON.stringify({ error: "Saldo insuficiente" }),
        { status: 400 }
      );
    }

    // 💸 DEBITA V-BUCKS
    await prisma.user.update({
      where: { id: user.id },
      data: { vbucks: user.vbucks - item.price },
    });

    // 🧾 REGISTRA A COMPRA
    await prisma.purchase.create({
      data: {
        userId: user.id,
        cosmeticId: item.id,
      },
    });

    return new Response(
      JSON.stringify({ message: "Compra realizada com sucesso!" }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erro ao comprar item:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno no servidor",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
