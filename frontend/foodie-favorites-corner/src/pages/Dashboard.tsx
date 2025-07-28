import RecommendedRecipes from "@/components/RecommendedRecipes";

const Dashboard = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
            <RecommendedRecipes />
        </div>
    );
};

export default Dashboard;
