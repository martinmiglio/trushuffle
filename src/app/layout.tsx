import "./globals.css";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import FooterBar from "@/components/page/FooterBar";
import NavBar from "@/components/page/NavBar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Montserrat as Font } from "next/font/google";

const inter = Font({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruShuffle",
  description: "Truly random music shuffling for Spotify",
  icons: `/icon?v1`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className="bg-theme-200 dark:bg-theme-800 text-theme-800 dark:text-theme-200"
    >
      <AuthSessionProvider session={session}>
        <body className={inter.className}>
          <div className="mx-auto flex h-screen w-full max-w-screen-md flex-col justify-between px-4">
            <div className="flex flex-col">
              <NavBar title={metadata.title?.toString() ?? ""} />
              {children}
            </div>
            <FooterBar />
          </div>
        </body>
      </AuthSessionProvider>
    </html>
  );
}
