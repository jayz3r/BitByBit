import Link from "next/link";
import ProductCard from "./components/ProductCard";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="p-10">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row lg:justify-between gap-12">
            <Image
              src="/gif.svg"
              alt="Hero illustration"
              width={400}
              height={400}
              className="rounded-lg shadow-2xl"
            />

            <div className="max-w-xl text-center gap-50">
              <h1 className="text-4xl font-bold">Learn Anything, Bit by Bit</h1>
              <p className="py-6 text-xl">
                Practice skills, track your progress, and get AI-powered
                guidance to improve in anything from languages to math,
                programming, and more.
              </p>
              <div className="links flex flex-col gap-4 max-w-xs mx-auto lg:mx-auto">
                <Link href="/courses" className="w-full">
                  <button className="btn btn-primary w-full text-white">
                    Get Started
                  </button>
                </Link>
                <Link href="/login" className="w-full">
                  <button className="btn btn-secondary w-full">
                    Already have an account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Link href="/users">Users</Link>
        <ProductCard />
      </div>
    </main>
  );
}
