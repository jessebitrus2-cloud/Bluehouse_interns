import RecipeCard from './RecipeCard.jsx'

export default function RecipeGrid({ meals, favorites, onOpen, onToggleFavorite }) {
  if (!meals.length) {
    return (
      <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-16 text-center text-cream">
        <p className="font-display text-2xl">No plates on the counter yet</p>
        <p className="mt-2 text-cream/80">
          Try another ingredient, cuisine, or tap Surprise me.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          favorite={favorites.includes(meal.idMeal)}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
