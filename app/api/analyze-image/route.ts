import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const endpoint = process.env.AZURE_VISION_ENDPOINT;
    const key = process.env.AZURE_VISION_KEY;

    if (!endpoint || !key) {
      return NextResponse.json({ error: "Vision configuration missing" }, { status: 503 });
    }

    // Convert file to ArrayBuffer
    const buffer = await image.arrayBuffer();

    // Call Azure Computer Vision 4.0 (or 3.2 depending on tier, assuming 3.2 for standard analysis)
    // Using simple "describe" feature
    const url = `${endpoint}/vision/v3.2/describe?maxCandidates=1&language=en`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure Vision API Error:", response.status, errorText);
      return NextResponse.json({ error: "Image analysis failed" }, { status: 500 });
    }

    const data = await response.json();
    const caption = data.description?.captions[0]?.text || "No description available";
    const tags = data.description?.tags || [];

    // Simple heuristic for plant disease since we aren't using a custom model yet
    const diagnosis = {
      plantType: tags.find((t: string) => ['plant', 'leaf', 'tree', 'maize', 'crop', 'vegetable'].includes(t)) || "Plant",
      condition: tags.includes('disease') || tags.includes('fungus') || caption.includes('brown') || caption.includes('yellow') ? "Potential Issue" : "Healthy Appearance",
      severity: "Unknown",
      symptoms: tags.filter((t: string) => ['yellow', 'brown', 'spots', 'withered', 'insect'].includes(t)),
      confidence: `${(data.description?.captions[0]?.confidence * 100).toFixed(0)}%`
    };

    return NextResponse.json({
      analysis: diagnosis,
      rawVision: { caption, tags }
    });

  } catch (error) {
    console.error("Vision API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
