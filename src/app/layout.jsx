import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers/providers";
import HeaderWrapper from "./components/layouts/header/HeaderWrapper";
import Footer from "./components/layouts/footer/Footer";
import OTPConfirmModal from "./components/ui/Modals/OTPmodal";
import ClientOnly from "./components/ClientOnly";
import { AuthProvider } from "./providers/authprovider";
import AdressModal from "./components/ui/Modals/AddressModal";
import { FloatBtn } from "./components/ui/floatingBtn/FloatBtn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SeasonDecor",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth !pr-0" suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders>
          <AuthProvider>
            <ClientOnly>
              <div className="flex min-h-screen flex-col relative">
                <HeaderWrapper />
                <OTPConfirmModal />
                <AdressModal />
                <FloatBtn />

                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ClientOnly>
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
