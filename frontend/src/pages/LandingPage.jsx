import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Layers, Pin, PlaneTakeoff } from "lucide-react";
import { UserContext } from "../contexts/userContext";

const features = [
  [Layers, "Practice by role", "Generate interview questions based on your target role, experience, and topics."],
  [BookOpen, "Explore model answers", "Read sample answers and ask for a deeper explanation when a concept is unfamiliar."],
  [Pin, "Revisit tricky questions", "Save your practice sessions and pin questions you want to review again."],
];

export default function LandingPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-950">
      <header className="border-b border-slate-900/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <PlaneTakeoff size={22} aria-hidden="true" /> PrepPilot<span className="-ml-2 text-emerald-700">.AI</span>
          </Link>
          <Link className="rounded-lg border border-slate-900/20 px-4 py-2 text-sm font-bold hover:bg-white" to={user ? "/dashboard" : "/login"}>
            {user ? "Dashboard" : "Log in"}
          </Link>
        </nav>
      </header>
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:py-24">
          <div>
            <p className="mb-4 text-sm font-bold tracking-wide text-emerald-800">AI interview practice</p>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-7xl">
              Practice for your <span className="text-emerald-800">next interview.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
              Build a question set around the job you want. Work through sample answers at your pace and come back anytime.
            </p>
            <Link to={user ? "/dashboard" : "/signup"} className="action-button mt-8">
              {user ? "Open dashboard" : "Start practicing"} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="rounded-3xl bg-[#13382e] p-5 text-white shadow-xl shadow-emerald-950/15 sm:p-8">
            <p className="text-sm font-bold text-emerald-200">Sample practice session</p>
            <h2 className="mt-2 text-2xl font-bold">Frontend developer</h2>
            <p className="mt-1 text-emerald-100">React · State management</p>
            <div className="mt-6 rounded-2xl bg-white p-5 text-slate-900">
              <p className="font-bold">When should state be lifted in React?</p>
              <p className="mt-3 leading-relaxed text-slate-600">
                Move shared state to the closest common parent so related components stay in sync.
              </p>
            </div>
          </div>
        </section>
        <section aria-label="Practice features" className="mx-auto grid max-w-6xl gap-4 px-5 pb-14 sm:px-8 md:grid-cols-3">
          {features.map((feature) => {
            const [Icon, title, description] = feature;
            return (
            <article key={title} className="rounded-2xl border border-slate-900/10 bg-white p-6">
              <Icon size={22} className="text-emerald-800" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
            </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
