import Link from "next/link";

/** Static host: HTML redirect so Apache/Plesk is not a blank JS shell. */
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/th/" />
      <script
        dangerouslySetInnerHTML={{
          __html: "location.replace('/th/');",
        }}
      />
      <p className="p-10 text-center text-sm">
        <Link href="/th/" className="underline">
          KRABI LINKS TAXI — เข้าสู่เว็บไซต์
        </Link>
      </p>
    </>
  );
}
