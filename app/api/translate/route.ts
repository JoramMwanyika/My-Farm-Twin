import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, to, from } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.AZURE_TRANSLATOR_KEY;
    const region = process.env.AZURE_TRANSLATOR_REGION;

    if (!endpoint || !key || !region) {
      console.warn("Azure Translator keys missing");
      return NextResponse.json({ error: "Translator configuration missing" }, { status: 503 });
    }

    const url = `${endpoint}/translate?api-version=3.0&to=${to}${from ? `&from=${from}` : ''}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: text }]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure Translator API Error:", response.status, errorText);
      return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }

    const data = await response.json();
    const translatedText = data[0].translations[0].text;

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
