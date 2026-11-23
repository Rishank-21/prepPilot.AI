export default function RoleInfoHeader({ role, topicsToFocus, experience, questions, description, lastUpdated }) {
  return (
    <header className="rounded-2xl bg-[#13382e] p-6 text-white sm:p-8">
      <h1 className="break-words text-3xl font-extrabold tracking-tight">{role}</h1>
      <p className="mt-2 break-words text-emerald-100">{topicsToFocus}</p>
      {description && <p className="mt-3 break-words">{description}</p>}
      <ul className="mt-5 flex flex-wrap gap-2 text-sm text-emerald-50">
        <li className="rounded-full bg-white/10 px-3 py-1">{experience} {Number(experience) === 1 ? "year" : "years"} of experience</li>
        <li className="rounded-full bg-white/10 px-3 py-1">{questions} {questions === 1 ? "question" : "questions"}</li>
        {lastUpdated && <li className="rounded-full bg-white/10 px-3 py-1">Updated {lastUpdated}</li>}
      </ul>
    </header>
  );
}
