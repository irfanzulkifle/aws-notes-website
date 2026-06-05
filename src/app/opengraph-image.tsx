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
          background: "#ffffff",
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
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              A
            </span>
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#6B7280",
            }}
          >
            AWS re/Start Notes
          </span>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.025em",
            textAlign: "center",
          }}
        >
          Learning Journal
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#6B7280",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          30 lecture notes across 8 weeks of cloud computing
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {["Linux", "Python", "SQL", "AWS Cloud", "Security"].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                color: "#6B7280",
                fontSize: 14,
                fontWeight: 500,
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
