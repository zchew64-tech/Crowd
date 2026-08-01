export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-20 max-w-7xl border-t border-white/10 pt-8 pb-4 text-center">
      <p className="text-sm text-zinc-500">
        Built by UCR students, for UCR students.
      </p>
      <p className="mt-2 text-xs text-zinc-600">
        Have feedback or spotted an issue?{" "}
        <a href="mailto:crowd.ucr@gmail.com" className="text-purple-400 underline decoration-purple-400/40 underline-offset-4 hover:text-purple-300">
          Let us know
        </a>
      </p>
    </footer>
  );
}