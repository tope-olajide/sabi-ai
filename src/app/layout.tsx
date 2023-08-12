import './globals.css'
export const metadata = {
  title: "Sability AI",
  description: "Elevate Your Expression with Flawless Precision!"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
