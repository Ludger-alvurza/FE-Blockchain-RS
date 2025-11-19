import Image from "next/image";
import { Data } from "../interfaces";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const res = await fetch("http://localhost:3001/", {
      cache: "no-store", // data selalu fresh
    });

    // Cek kalau response gagal (status bukan 2xx)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Data = await res.json();

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />

          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {data.title}
            </h1>

            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {data.message}
            </p>
            <ul className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {data.people.map((person, idx) => (
                <li key={idx}>{person}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="#"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Deploy Now
            </a>

            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
              href="#"
            >
              Documentation
            </a>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Fetch API error:", error);

    // UI fallback kalau API gagal
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 font-sans dark:bg-black">
        <main className="flex flex-col items-center justify-center py-32 px-16 text-center">
          <h1 className="text-3xl font-semibold text-red-600">
            Terjadi kesalahan saat mengambil data
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </main>
      </div>
    );
  }
}
