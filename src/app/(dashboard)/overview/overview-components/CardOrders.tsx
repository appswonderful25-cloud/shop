import { ArrowUp, Package,ArrowDown } from "lucide-react";

const Orders = [
    { count: 3333, parcentage: 9.01, status: "Down" },
]

const CardOrders = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md w-fit max-[1100px]:w-full">
                <div className="dark:bg-zinc-800 bg-gray-100 w-fit p-2 rounded-lg"><Package size={40} className="p-1.5" /></div>
                <h3 className="text-gray-500 mt-6 mb-4">Orders</h3>
                <div className="flex min-[480px]:gap-30 items-center justify-between">
                    <p className="text-3xl font-bold">{Orders[0].count}</p>
                    <p className="flex bg-red-200 px-1 gap-1 rounded-lg text-red-600">{Orders[0].status === "Up" ? <ArrowUp /> : <ArrowDown />} {Orders[0].parcentage}%</p>
                </div>
            </div>
)}

export default CardOrders;