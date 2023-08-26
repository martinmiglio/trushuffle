import Link from "next/link";

export default function FooterBar() {
  return (
    <footer className="flex w-full flex-row flex-wrap items-center justify-between py-8 text-sm opacity-60">
      <div className="pb-1">
        © 2023{" "}
        <Link href="https://martinmiglio.dev/" className="hover:underline">
          Martin Miglio
        </Link>
      </div>
    </footer>
  );
}
