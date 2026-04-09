import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#0A0A0A", borderRadius: "50%", border: "4px solid #C9A84C", color: "#C9A84C", fontSize: 30, fontWeight: 700 }}>
      C
    </div>,
    size
  );
}
