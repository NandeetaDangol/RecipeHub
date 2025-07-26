import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type RecipeSaveButtonProps = {
    recipeId: number;
    user: {
        id: number;
        token: string;
    } | null;
};

const RecipeSaveButton = ({ recipeId, user }: RecipeSaveButtonProps) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [bookmarkId, setBookmarkId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            if (!user) return;

            try {
                const response = await axios.get(
                    `/api/bookmarks/check/${recipeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setIsBookmarked(response.data.is_bookmarked);
            } catch (error) {
                console.error("Failed to fetch bookmark status:", error);
            }
        };

        fetchBookmarkStatus();
    }, [user, recipeId]);

    const toggleBookmark = async () => {
        if (!user) {
            alert("Please login to save this recipe.");
            return;
        }

        try {
            setLoading(true);

            if (isBookmarked) {
                // Get all bookmarks to find the correct bookmark ID
                const all = await axios.get(`/api/bookmarks`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const target = all.data.find(
                    (b: any) => b.recipe.id === recipeId
                );

                if (target) {
                    await axios.delete(`/api/bookmarks/${target.id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    setIsBookmarked(false);
                }
            } else {
                await axios.post(
                    `/api/bookmarks`,
                    { recipe_id: recipeId },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={toggleBookmark} disabled={loading} variant={isBookmarked ? "secondary" : "outline"}>
            {isBookmarked ? "💾 Saved" : "💾 Save"}
        </Button>
    );
};

export default RecipeSaveButton;
