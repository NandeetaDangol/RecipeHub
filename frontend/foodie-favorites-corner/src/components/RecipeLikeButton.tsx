import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type RecipeLikeButtonProps = {
    recipeId: number;
    user: {
        id: number;
        token: string;
    } | null;
};

const RecipeLikeButton = ({ recipeId, user }: RecipeLikeButtonProps) => {
    const [state, setState] = useState<"liked" | "disliked" | null>(null);
    const [loading, setLoading] = useState(false);
    const [totalLikes, setTotalLikes] = useState<number>(0);

    // Fetch current like state and total likes for this recipe
    useEffect(() => {
        if (!user) return;

        axios
            .get(`/api/recipe-likes/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                setState(res.data.data.user_state); // liked, disliked, or null
                setTotalLikes(res.data.data.total_likes);
            })
            .catch((err) => {
                console.error("Error fetching like info:", err);
            });
    }, [user, recipeId]);

    // Toggle like state
    const handleLike = async () => {
        if (!user) {
            alert("Please log in to like recipes.");
            return;
        }

        try {
            setLoading(true);
            const newState = state === "liked" ? "disliked" : "liked";

            const response = await axios.post(
                "/api/recipe-likes",
                {
                    recipe_id: recipeId,
                    state: newState,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setState(response.data.data.state);

            // Refresh total likes after toggling
            const res = await axios.get(`/api/recipe-likes/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setTotalLikes(res.data.data.total_likes);
        } catch (error) {
            console.error("Failed to toggle like:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleLike}
                disabled={loading}
                variant={state === "liked" ? "destructive" : "outline"}
            >
                {state === "liked" ? "❤️ Liked" : "🤍 Like"}
            </Button>
            <span>{totalLikes}</span>
        </div>
    );
};

export default RecipeLikeButton;
