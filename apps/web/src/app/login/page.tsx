import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { TestimonialCarousel } from "@/components/auth/testimonial-carousel";

export default function Login() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-8 py-6 lg:px-16">
          <div className="w-full max-w-[420px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-base font-semibold">
                S
              </div>
              <h1 className="text-2xl font-bold">
                stack<span className="text-blue-500">dev</span>
              </h1>
            </div>

            <h2 className="text-3xl font-bold mb-1">Welcome back</h2>
            <p className="text-zinc-500 mb-6">Please enter your details to sign in.</p>

            <Suspense>
              <AuthPanel />
            </Suspense>
          </div>
        </section>

        <section className="relative my-8 mr-8 hidden overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#101a33] to-[#142447] lg:block">
          <CodeBackdrop />

          <div className="absolute bottom-8 left-8 right-8">
            <TestimonialCarousel />
          </div>
        </section>
      </div>
    </main>
  );
}

function CodeBackdrop() {
  const lines = [80, 55, 70, 40, 65, 90, 50, 75, 60, 45, 85, 55];

  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-10 opacity-40 blur-[1px]">
      {lines.map((width, index) => (
        <div
          key={index}
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}
