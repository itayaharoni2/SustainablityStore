import { useUserContext } from "@/context/auth-context";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const AddToCartButton = ({ product }: { product: Product }) => {
const { addItem } = useCart();
const [isSuccess, setIsSuccess] = useState<boolean>(false);

const { isAuthenticated } = useUserContext();
const navigate = useNavigate();

useEffect(() => {
const timeout = setTimeout(() => {
setIsSuccess(false);
}, 2000);

return () => clearTimeout(timeout);
}, [isSuccess]);

return (
<Button
onClick={() => {
if (!isAuthenticated) navigate("/sign-in");
addItem(product);
setIsSuccess(true);
}}
size="lg"
className="w-full"
>
{isSuccess ? "Added!" : "Add to cart"}
</Button>
);
};

export default AddToCartButton;