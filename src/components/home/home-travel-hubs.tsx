import Link from "next/link";
import { ArrowRight, BookOpen, Map, Ship } from "lucide-react";

const hubs = [
  {
    href: "/tours",
    title: "Tours",
    desc: "Day trips to Phi Phi, 4 Islands, Hong Island, and more.",
    icon: Map,
  },
  {
    href: "/boat-schedules",
    title: "Boat Schedules",
    desc: "Mock ferry, speedboat, and longtail departure times.",
    icon: Ship,
  },
  {
    href: "/travel-info",
    title: "Travel Info",
    desc: "Guides for Ao Nang, Railay, Phi Phi, and Krabi–Phuket.",
    icon: BookOpen,
  },
];

export function HomeTravelHubs() {
  return (
    <section className="border-y bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold">Travel Intelligence</h2>
          <p className="mt-2 text-muted-foreground">
            Tours, boat times, and destination tips — then book your transfer
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {hubs.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <hub.icon className="size-8 text-amber-700" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-amber-800">
                {hub.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {hub.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                Explore <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
