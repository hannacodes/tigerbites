import './meal-container.css';
import { useEffect, useState } from "react";
import { getFoodItems } from "../services/foodServices.tsx";
import { Food } from "../types/firebaseTypes.tsx";
import { useNavigate } from 'react-router-dom';
import magnet1 from '../assets/Magnets/tigers-flag-tp.png';
import magnet2 from '../assets/Magnets/balloon-binary-tp.png';
import magnet3 from '../assets/Magnets/tigers-flag-tp.png';
import magnet4 from '../assets/Magnets/utensils-tp.png';


interface MealContainerProps {
    onMealClick: (id: string) => void;
}

export default function MealContainer({}: MealContainerProps) {
    const [foodItems, setFoodItems] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const magnets = [magnet1, magnet2, magnet3, magnet4];

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const data = await getFoodItems();
                const now = new Date();
                const filteredData = data.filter((food: Food) => {
                    const end = food.endPickup ? food.endPickup : new Date(food.endPickup);
                    return food.mealsAvailable > 0 && now <= end; // Meal must be available & within pickup time range
                });
                setFoodItems(filteredData);
                console.log("Fetched food items:", data);
                console.log("Displaying food items:", filteredData);
            } catch (error) {
                console.error("Error fetching food items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, []);

    if (loading) return <p>Loading food items...</p>;

    const getRandomMagnet = () => {
        const randomIndex = Math.floor(Math.random() * magnets.length);
        return magnets[randomIndex];
      };

    return (
        <>
        <div className="meal-container">
            {foodItems.map((food) => (
                <div key={food.id} className="polaroid" onClick={() => navigate(`/meal/${food.id}`)}>
                    <div className='image-container'>
                <img src={getRandomMagnet()} alt="Magnet" className="magnet-image" />
                <img src={food.imageUrl || "default-image-url.jpg"} className='food-image' />
                </div>
                <p className="caption">   </p>
            </div>
            ))}
        </div>
        </>
    );
}