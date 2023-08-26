import AccountButton from "@/components/auth/AccountButton";
import Link from "next/link";

export default function NavBar({ title }: { title: string }) {
  return (
    <div className="relative flex w-full justify-between py-4 items-center">
      <h1 className="mx-auto text-3xl font-bold text-theme-600">
        <Link href="/">{title}</Link>
      </h1>
      <div className="absolute right-0">
        <AccountButton />
      </div>
    </div>
  );
}
