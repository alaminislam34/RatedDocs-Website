export default function PhaseStep({
  step,
  title,
}: {
  step: number;
  title: string;
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase text-[#0E3E65]">
        Step {step}
      </span>
      <p className="text-lg lg:text-xl font-medium text-[#1A1A2E]">
        {title}
      </p>
    </div>
  );
}
