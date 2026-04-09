import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM env vars");
      return NextResponse.json({ ok: true });
    }
    const text = `🔥 Новая заявка НЕЙРОСТАРТ!\n\n👤 ${name || "—"}\n📧 ${email || "—"}\n📱 ${phone || "—"}\n\n⏰ ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead error:", e);
    return NextResponse.json({ ok: true });
  }
}
