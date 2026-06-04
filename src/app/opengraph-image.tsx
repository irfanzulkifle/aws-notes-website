import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AWS re/Start Notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            background: "linear-gradient(90deg, #60a5fa, #22d3ee, #2dd4bf)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
          }}
        >
          AWS re/Start Notes
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          A structured learning journal covering cloud computing fundamentals
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
          }}
        >
          {["Linux", "Python", "SQL", "Networking", "AWS Cloud"].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "6px 16px",
                borderRadius: 9999,
                border: "1px solid #334155",
                background: "#1e293b",
                color: "#94a3b8",
                fontSize: 16,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
