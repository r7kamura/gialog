import { format } from "date-fns";

export default function Time({ dateTime }: { dateTime: string }) {
  return (
    <time dateTime={dateTime}>{format(new Date(dateTime), "yyyy-MM-dd")}</time>
  );
}
