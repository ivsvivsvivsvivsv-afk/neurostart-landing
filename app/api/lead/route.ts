import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, testResult } = await req.json();

    // Валидация
    const cleanName = String(name || "").slice(0, 100);
    const cleanEmail = String(email || "").slice(0, 100);
    const cleanPhone = String(phone || "").slice(0, 30);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
    }

    // Безопасный testResult
    const safeTest = testResult ? {
      score: Math.min(21, Math.max(0, Number(testResult.score) || 0)),
      level: String(testResult.level || "").slice(0, 30),
      answers: Array.isArray(testResult.answers) ? testResult.answers.slice(0, 7).map(Number) : [],
    } : null;

    const testLine = safeTest ? `\n\n📊 Тест: ${safeTest.score}/21 — ${safeTest.level}\nОтветы: ${safeTest.answers.join(",")}` : "";
    const text = `🔥 Новая заявка НЕЙРОСТАРТ!\n\n👤 ${cleanName || "—"}\n📧 ${cleanEmail}\n📱 ${cleanPhone || "—"}${testLine}\n\n⏰ ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM env vars");
      return NextResponse.json({ ok: true });
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let tgRes: Response;
    try {
      tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof Error && e.name === "AbortError") {
        return NextResponse.json({ ok: false }, { status: 504 });
      }
      throw e;
    }
    clearTimeout(timeoutId);
    if (!tgRes.ok) {
      console.error("Telegram error:", await tgRes.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
