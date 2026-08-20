import { useEffect, useState } from 'react'
import { lookupMeal, mealIngredients } from '../api/meals.js'
import ReviewSection from './ReviewSection.jsx'

export default function RecipeModal({
  mealId,
  onClose,
  favorite,
  onToggleFavorite,
  reviews,
  onAddReview,
}) {
  const [meal, setMeal] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    lookupMeal(mealId)
      .then((result) => {
        if (!cancelled) setMeal(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [mealId])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const ingredients = meal ? mealIngredients(meal) : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-sage-deep/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-cream-soft shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {loading && (
          <div className="p-10 text-center text-sage">Pulling the recipe card…</div>
        )}
        {error && <div className="p-10 text-center text-copper">{error}</div>}
        {meal && (
          <>
            <div className="relative h-56 sm:h-72">
              <img
                src={meal.strMealThumb}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-deep via-sage-deep/20 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-sm font-semibold text-sage-deep"
              >
                Close
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-sm uppercase tracking-[0.2em] text-cream/80">
                  {meal.strArea} · {meal.strCategory}
                </p>
                <h2 id="recipe-title" className="font-display text-3xl text-cream sm:text-4xl">
                  {meal.strMeal}
                </h2>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(meal)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    favorite ? 'bg-copper text-white' : 'bg-sage text-cream'
                  }`}
                >
                  {favorite ? 'Saved to pantry' : 'Save to pantry'}
                </button>
                {meal.strYoutube && (
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sage ring-1 ring-sage/15"
                  >
                    Watch technique
                  </a>
                )}
                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sage ring-1 ring-sage/15"
                  >
                    Original source
                  </a>
                )}
              </div>

              <section>
                <h3 className="mb-3 font-display text-2xl text-sage-deep">Ingredients</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {ingredients.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between gap-3 rounded-xl bg-cream px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-sage-deep">{item.name}</span>
                      <span className="text-sage/70">{item.measure}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 font-display text-2xl text-sage-deep">Method</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-sage/90">
                  {meal.strInstructions}
                </p>
              </section>

              <ReviewSection
                mealId={meal.idMeal}
                reviews={reviews}
                onAddReview={onAddReview}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
