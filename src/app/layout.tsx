import { Inter, Sora, Space_Grotesk, Plus_Jakarta_Sans, Manrope, Outfit, DM_Sans, Cormorant_Garamond, Tajawal } from "next/font/google";
import Providers from "@/components/Providers";
import { Metadata } from "next";
import "@/app/globals.css";
import { cookies } from "next/headers";
import SocketConnection from "@/components/hooks/SocketConnection";


const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sora" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-plus-jakarta" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dm-sans" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cormorant" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: "Dashboard - My Palace",
  description: "Welcome to my tech palace",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || '';
  
  return (
   
   <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${manrope.variable} ${outfit.variable} ${dmSans.variable} ${cormorant.variable} ${tajawal.variable} h-full antialiased`}
      suppressHydrationWarning 
    >
      
    <body className="min-h-full flex flex-col " suppressHydrationWarning >
      <Providers token={token}>
        <SocketConnection token={token}>{children}</SocketConnection>
      </Providers>
    </body>
   
   </html>
   
  );
}

