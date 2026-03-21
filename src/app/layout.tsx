import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "道の駅ガイド",
  description: "全国の道の駅を横断して探せる道の駅ディレクトリ"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
