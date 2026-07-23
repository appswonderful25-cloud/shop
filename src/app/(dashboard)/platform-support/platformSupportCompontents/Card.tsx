import { Ticket, Hourglass, CheckCircle2, LucideIcon } from "lucide-react";
import { SupportTicket } from "../page";

interface CardProps {
  id: number;
  colorCard: string;
  cardCount: number;
  cardTitle: string;
  CardIcon: LucideIcon;
}

const card = [
  { id: 1, title: "Total tickets", status: "total", icon: Ticket },
  { id: 2, title: "Pending tickets", status: "pending", icon: Hourglass },
  { id: 3, title: "Solved tickets", status: "solved", icon: CheckCircle2 },
];

const CardPrint = ({ id, colorCard, cardCount, cardTitle, CardIcon }: CardProps) => (
  <div key={id} className="border border-gray-200 dark:border-zinc-800 shadow-md w-full flex flex-row items-center gap-4 p-4 rounded-lg">
    <div className={`${colorCard} p-2 rounded-lg`}>
      <CardIcon size={30} />
    </div>
    <div>
      <p className="font-bold text-slate-900 dark:text-white">{cardCount}</p>
      <h1 className="text-gray-500 dark:text-zinc-400">{cardTitle}</h1>
    </div>
  </div>
);

const calculateCount = (data: SupportTicket[]) => {
  let total = 0, pending = 0, solved = 0;
  data.forEach((item) => {
    if (item.status === "solved") solved += 1;
    else if (item.status === "pending" || item.status === "in_progress") pending += 1;
    total += 1;
  });
  return { total, pending, solved };
};

const Card = ({ data }: { data: SupportTicket[] }) => {
  const { total, pending, solved } = calculateCount(data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {card.map((item) => (
        <CardPrint
          id={item.id}
          key={item.id}
          colorCard={
            item.status === "total"
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
              : item.status === "pending"
              ? "bg-orange-50 text-orange-500 dark:bg-orange-950/30 dark:text-orange-400"
              : "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400"
          }
          cardCount={item.status === "total" ? total : item.status === "pending" ? pending : solved}
          cardTitle={item.title}
          CardIcon={item.icon}
        />
      ))}
    </div>
  );
};

export default Card;
