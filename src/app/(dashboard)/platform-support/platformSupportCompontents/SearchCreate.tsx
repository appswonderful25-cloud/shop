import { Search, Plus } from "lucide-react";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import AddTicket from "./addTicket";
import { DataContext } from "../page";

export default function SearchCreate({ setSearch }: { setSearch: React.Dispatch<React.SetStateAction<string>> }) {
  const { loadData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2" dir="ltr">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-slate-400 dark:text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold h-[40px] px-4 rounded-xl shadow-md shadow-indigo-100 dark:shadow-none active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add New</span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-black dark:text-white font-bold text-xl tracking-tight">Add New Ticket</h2>
              <p className="text-zinc-400 mt-2 text-sm">Create a new support ticket for a customer.</p>
              <AddTicket
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onCreated={() => {
                  setIsOpen(false);
                  loadData();
                }}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
