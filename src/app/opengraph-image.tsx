import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Nexora — the enterprise Growth Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const markPath = join(process.cwd(), "public/brand/nexora-mark-512.png");
  const markBuffer = await readFile(markPath);
  const markSrc = `data:image/png;base64,${markBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#0a0908",
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(224,175,59,0.16), transparent 45%), radial-gradient(circle at 85% 85%, rgba(174,111,66,0.14), transparent 45%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={140} height={140} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 600,
            letterSpacing: 6,
            color: "#f3f1ef",
          }}
        >
          NEXORA
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#e0af3b",
            letterSpacing: 2,
          }}
        >
          Enterprise Growth Platform
        </div>
      </div>
    ),
    { ...size },
  );
}
