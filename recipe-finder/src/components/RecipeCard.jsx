export default function RecipeCard({ meal, favorite, onOpen, onToggleFavorite }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-cream-soft shadow-lg shadow-sage-deep/15 ring-1 ring-white/50 transition hover:-translate-y-1 hover:shadow-xl">
      <button type="button" onClick={() => onOpen(meal)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={meal.strMealThumb}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/70 via-transparent to-transparent" />
          {meal.matchType && (
            <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage">
              {meal.matchType === 'ingredient' ? 'Ingredient' : 'Recipe'}
            </span>
          )}
          <h3 className="absolute bottom-3 left-3 right-12 font-display text-lg leading-tight text-cream">
            {meal.strMeal}
          </h3>
        </div>
      </button>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-sage/70">
          {meal.strArea || 'Kitchen classic'}
          {meal.strCategory ? ` · ${meal.strCategory}` : ''}
        </p>
        <button
          type="button"
          onClick={() => onToggleFavorite(meal)}
          className={`rounded-full px-3 py-1 text-sm ${
            favorite ? 'bg-copper/15 text-copper' : 'text-sage/50 hover:text-copper'
          }`}
          aria-label={favorite ? 'Remove from saved' : 'Save recipe'}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}
