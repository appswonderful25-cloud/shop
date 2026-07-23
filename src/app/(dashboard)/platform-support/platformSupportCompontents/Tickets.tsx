import Filter from "./Filter";
import SearchCreate from "./SearchCreate";
import TicketTable from "./TicketTable";
import { useState } from "react";

const Tickets = () => {
  const [sharedData, setSharedData] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  return (
    <>
      <div className="flex flex-col gap-4 py-4 px-6 mt-6" dir="ltr">
        {/* Top row: Title + Filter + Search+Add */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">Support Tickets</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">Your most recent support tickets list</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Filter setSharedData={setSharedData} />
            <SearchCreate setSearch={setSearch} />
          </div>
        </div>
      </div>
      <div className="w-full">
        <TicketTable sharedData={sharedData} search={search} />
      </div>
    </>
  );
};

export default Tickets;
