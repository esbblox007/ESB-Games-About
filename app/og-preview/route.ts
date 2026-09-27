import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const h = React.createElement;
const site = "https://about.esbgames.com";

export async function GET() {
  const image = new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          background: "#030611",
          color: "#f7f8ff",
          fontFamily: "Arial, Helvetica, sans-serif",
        },
      },
      [
        h("div", {
          key: "glow",
          style: {
            position: "absolute",
            inset: "72px 0 0 0",
            background:
              "linear-gradient(105deg, rgba(85,31,151,.08) 10%, rgba(117,36,207,.42) 48%, rgba(28,111,207,.52) 100%)",
          },
        }),
        h("div", {
          key: "grid",
          style: {
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(94,113,163,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(94,113,163,.35) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          },
        }),
        h(
          "div",
          {
            key: "header",
            style: {
              height: "72px",
              padding: "0 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(120,140,190,.16)",
              background: "rgba(3,6,17,.9)",
              zIndex: 2,
            },
          },
          [
            h("div", { key: "brand", style: { display: "flex", alignItems: "center" } }, [
              h("img", {
                key: "logo",
                src: site + "/esb-blue-logo.png",
                width: 38,
                height: 38,
                style: { objectFit: "contain", marginRight: "12px" },
              }),
              h("div", { key: "brandtext", style: { display: "flex", flexDirection: "column" } }, [
                h("strong", { key: "name", style: { fontSize: "18px", letterSpacing: "-.3px" } }, "ESB GAMES"),
                h(
                  "span",
                  { key: "tag", style: { fontSize: "8px", letterSpacing: "4px", color: "#9da7c5", marginTop: "4px" } },
                  "DISCOVER. BELONG. BUILD."
                ),
              ]),
            ]),
            h(
              "div",
              {
                key: "nav",
                style: {
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 10px",
                  border: "1px solid rgba(120,140,190,.24)",
                  borderRadius: "24px",
                  background: "rgba(13,18,35,.75)",
                  fontSize: "13px",
                  color: "#aeb6d0",
                },
              },
              [
                h("span", { key: "home", style: { padding: "7px 13px", borderRadius: "18px", background: "linear-gradient(100deg,#5635a8,#245e9f)", color: "white", fontWeight: 700 } }, "Home"),
                h("span", { key: "about", style: { padding: "7px 11px" } }, "About"),
                h("span", { key: "creator", style: { padding: "7px 11px" } }, "Creator Hub"),
                h("span", { key: "families", style: { padding: "7px 11px" } }, "Families"),
                h("span", { key: "news", style: { padding: "7px 11px" } }, "News"),
                h("span", { key: "careers", style: { padding: "7px 11px" } }, "Careers"),
                h("span", { key: "support", style: { padding: "7px 11px" } }, "Support"),
              ]
            ),
          ]
        ),
        h(
          "div",
          {
            key: "hero",
            style: {
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              width: "100%",
            },
          },
          [
            h(
              "div",
              {
                key: "copy",
                style: {
                  width: "43%",
                  padding: "58px 20px 28px 26px",
                  display: "flex",
                  flexDirection: "column",
                },
              },
              [
                h(
                  "div",
                  {
                    key: "title",
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "61px",
                      lineHeight: 0.94,
                      letterSpacing: "-4px",
                      fontWeight: 800,
                    },
                  },
                  [
                    h("span", { key: "t1" }, "The universe"),
                    h("span", { key: "t2" }, "where"),
                    h("span", { key: "t3" }, "everyone"),
                    h("span", { key: "t4" }, [
                      "can ",
                      h("span", { key: "d", style: { color: "#8b61e8" } }, "discover,"),
                    ]),
                    h("span", { key: "t5" }, [
                      h("span", { key: "b", style: { color: "#9e68e8" } }, "belong"),
                      " &",
                    ]),
                    h("span", { key: "t6", style: { color: "#4ebee3" } }, "build."),
                  ]
                ),
                h(
                  "div",
                  {
                    key: "lead",
                    style: {
                      marginTop: "22px",
                      width: "420px",
                      fontSize: "16px",
                      lineHeight: 1.42,
                      color: "#aeb6cf",
                    },
                  },
                  "ESB Games is building a connected gaming and creator ecosystem: many worlds, one community and room for ambitious ideas."
                ),
              ]
            ),
            h(
              "div",
              {
                key: "visual",
                style: {
                  width: "57%",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
              [
                h("div", {
                  key: "aurora",
                  style: {
                    position: "absolute",
                    width: "760px",
                    height: "520px",
                    right: "-70px",
                    top: "25px",
                    background: "radial-gradient(circle at 42% 45%, rgba(132,44,216,.52), rgba(39,104,213,.28) 48%, rgba(0,0,0,0) 76%)",
                  },
                }),
                h(
                  "div",
                  {
                    key: "studioframe",
                    style: {
                      position: "absolute",
                      width: "555px",
                      height: "315px",
                      right: "24px",
                      bottom: "18px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: "9px solid #111827",
                      background: "#0a0f1c",
                      boxShadow: "0 28px 70px rgba(0,0,0,.48)",
                    },
                  },
                  h("img", {
                    src: site + "/hero-studio-platform.png",
                    width: 537,
                    height: 297,
                    style: { width: "100%", height: "100%", objectFit: "cover" },
                  })
                ),
                h(
                  "div",
                  {
                    key: "discoverframe",
                    style: {
                      position: "absolute",
                      width: "410px",
                      height: "238px",
                      left: "18px",
                      top: "120px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "9px solid #121a2b",
                      background: "#0a0f1c",
                      boxShadow: "0 24px 60px rgba(0,0,0,.52)",
                    },
                  },
                  h("img", {
                    src: site + "/hero-discover-platform.png",
                    width: 392,
                    height: 220,
                    style: { width: "100%", height: "100%", objectFit: "cover" },
                  })
                ),
              ]
            ),
          ]
        ),
      ]
    ),
    { width: 1200, height: 630 }
  );

  image.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  return image;
}
