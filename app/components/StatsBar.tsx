type StatsBarProps = {
  total: number;
  plenty: number;
};

export default function StatsBar({ total, plenty }: StatsBarProps) {
  return (
    <div className="stat">
      <span className="dot" />
      <b>Live</b>
      <span>
        {total} spots tracked · {plenty} with plenty of seats
      </span>
    </div>
  );
}