
import { Link } from "react-router-dom";
import logoClose from "../../assets/logo-close.png";
import heroBg from "../../assets/new-top.png";
import cityBg from "../../assets/mcrft-bg.png";
import shieldImg from "../../assets/shieldImg.png";
import graphImg from "../../assets/graphImg.png";
import boltImg from "../../assets/boltImg.png";
import step1 from "../../assets/st1.png";
import step2 from "../../assets/stt2.png";
import step3 from "../../assets/stt3.png";
import avatar1 from "../../assets/pf1.jpeg";
import avatar2 from "../../assets/pf2.jpeg";
import avatar3 from "../../assets/pf3.jpeg";

const features = [
  {
    title: "Secure By Default",
    desc: "Built-in OAuth, role checks, and controlled secrets handling for safe team workflows.",
    icon: shieldImg,
  },
  {
    title: "Live Deployment Visibility",
    desc: "Track deployment states and logs in real-time with a clean operational timeline.",
    icon: graphImg,
  },
  {
    title: "Fast Rollout Pipeline",
    desc: "From repo connect to deploy link in minutes with guided flow and instant feedback.",
    icon: boltImg,
  },
];

const steps = [
  { title: "Connect Repository", img: step1 },
  { title: "Configure Environment", img: step2 },
  { title: "Deploy And Monitor", img: step3 },
];

const reviews = [
  {
    name: "Anaya",
    role: "Frontend Engineer",
    text: "Velora turned our manual release process into one click. The logs and rollback flow are excellent.",
    avatar: avatar1,
  },
  {
    name: "Ruhan",
    role: "DevOps Intern",
    text: "The UI is clean, and I can debug deployments quickly without jumping between tools.",
    avatar: avatar2,
  },
  {
    name: "Ira",
    role: "Product Builder",
    text: "We launched faster this sprint because setup, variables, and deploy checks are all in one place.",
    avatar: avatar3,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070a]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#hero" className="flex items-center gap-3">
            <img src={logoClose} alt="Velora" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-black tracking-widest">VELORA</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            <a href="#features" className="transition hover:text-lime-300">Features</a>
            <a href="#workflow" className="transition hover:text-lime-300">Workflow</a>
            <a href="#reviews" className="transition hover:text-lime-300">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-black hover:bg-lime-300">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section
        id="hero"
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,7,10,0.45), rgba(5,7,10,0.9)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <p className="mb-4 inline-flex rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
            Production-Grade DevOps Panel
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Deploy. Scale. Relax.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Connect your repo, configure environments, trigger deployments, and monitor everything from one dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black hover:bg-lime-300">
              Start Free
            </Link>
            <a href="#workflow" className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              See Workflow
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black sm:text-4xl">Why Teams Choose Velora</h2>
        <p className="mt-3 max-w-2xl text-white/70">
          Everything you need to ship confidently, without hard-to-manage deployment scripts.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <img src={item.icon} alt={item.title} className="h-11 w-11 rounded-lg object-cover" />
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="relative border-y border-white/10"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,7,10,0.8), rgba(5,7,10,0.95)), url(${cityBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-black sm:text-4xl">Simple 3-Step Workflow</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, idx) => (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <img src={step.img} alt={step.title} className="h-40 w-full rounded-xl object-cover" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-lime-300">
                  Step {idx + 1}
                </p>
                <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black sm:text-4xl">Builders Love Velora</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-white/60">{review.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/75">{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-lime-400/25 bg-lime-500/10 p-8 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Ready To Go Live?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Launch your next deployment with confidence and complete visibility.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black hover:bg-lime-300">
              Create Account
            </Link>
            <Link to="/login" className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
