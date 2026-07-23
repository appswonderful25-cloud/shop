import CardCustomers from "./CardCustomers";
import CardOrders from "./CardOrders";

const Card = () => {
    return (
        <div className="flex max-md:flex-col flex-row gap-4 mb-6">
            <CardCustomers />
            <CardOrders />
        </div>
    )
}               

export default Card;