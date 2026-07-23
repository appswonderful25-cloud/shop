import { Users, ArrowUp,ArrowDown } from "lucide-react";

const Customers = [
    { count: 3893, parcentage: 11.01, status: "Up" },
]

const CardCustomers = () => {
    return (
        
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md w-fit max-[1100]:w-full">
                <div className="dark:bg-zinc-800 bg-gray-100 w-fit p-2 rounded-lg"><Users size={40} className="p-1.5" /></div>
                <h3 className="text-gray-500 mt-6 mb-4">Customers</h3>
                <div className="flex min-[480px]:gap-30 items-center justify-between">
                    <p className="text-3xl font-extrabold">{Customers[0].count}</p>
                    <p className="flex bg-green-200 px-1 gap-1 rounded-lg text-green-600">{Customers[0].status === "Up" ? <ArrowUp /> : <ArrowDown />} {Customers[0].parcentage}%</p>
                </div>
            </div>
        );
};

export default CardCustomers;