import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["fonts.gstatic.com","myypelzqjunsrpytkiee.supabase.co"],
     // ここでフォント取得を許可
  },
  async headers() {
  return [
    {
      source: "/fonts/(.*)", //  正しいワイルドカード表記
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    },
  ];
},
};

export default nextConfig;
