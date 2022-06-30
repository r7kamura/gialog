import { format } from "date-fns";

export default function Time({ dateTime }: { dateTime: string }) {
  return (
    <time
      dateTime={dateTime}
      title={dateTime}
      className="block text-[.8rem] text-gray-500 dark:text-gray-400"
    >
      {format(new Date(dateTime), "yyyy-MM-dd")}
    </time>
  );
}
