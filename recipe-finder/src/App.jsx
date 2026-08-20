import { useEffect, useState } from 'react'
import Logo from './components/Logo.jsx'
import SearchBar from './components/SearchBar.jsx'
import CategoryPills from './components/CategoryPills.jsx'
import RecipeGrid from './components/RecipeGrid.jsx'
import RecipeModal from './components/RecipeModal.jsx'
import { useLocalList } from './hooks/useLocalList.js'
import {
  filterByArea,
  filterByCategory,
  getAreas,
  getCategories,
  getFeaturedMeals,
  getRandomMeal,
  searchRecipes,
} from './api/meals.js'

const PANTRY = ['Chicken', 'Tomato', 'Garlic', 'Salmon', 'Beef', 'Egg', 'Rice', 'Lemon']

function snapshot(meal) {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strArea: meal.strArea || '',
    strCategory: meal.strCategory || '',
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [category, setCategory] = useState('')
  const [meals, setMeals] = useState([])
  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])
  const [heading, setHeading] = useState('Tonight on the pass')
  const [meta, setMeta] = useState('Featured plates from working kitchens around the world.')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showSaved, setShowSaved] = useState(false)
  const [favorites, setFavorites] = useLocalList('hearth-favorites', [])
  const [reviews, setReviews] = useLocalList('hearth-reviews', {})

  const favoriteIds = favorites.map((meal) => meal.idMeal)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getAreas().then(setAreas).catch(() => {})
    loadFeatured()
  }, [])

  async function loadFeatured() {
    setLoading(true)
    setError('')
    setShowSaved(false)
    setCategory('')
    try {
      const featured = await getFeaturedMeals(8)
      setMeals(featured)
      setHeading('Tonight on the pass')
      setMeta('A rotating set of featured recipes. Search any dish or ingredient to take over.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function runSearch(term = query, area = cuisine) {
    setLoading(true)
    setError('')
    setShowSaved(false)
    setCategory('')
    try {
      const q = term.trim()
      if (!q && area) {
        const results = await filterByArea(area)
        setMeals(results)
        setHeading(`${area} kitchen`)
        setMeta(`${results.length} recipes from this cuisine.`)
        return
      }

      if (!q) {
        await loadFeatured()
        return
      }

      const { meals: results, fromName, fromIngredient } = await searchRecipes(q)
      let next = results
      if (area) {
        const areaMeals = await filterByArea(area)
        const ids = new Set(areaMeals.map((meal) => meal.idMeal))
        next = results.filter((meal) => ids.has(meal.idMeal) || meal.strArea === area)
      }
      setMeals(next)
      setHeading(`Results for “${q}”`)
      setMeta(
        `${next.length} matches · ${fromName} by recipe name · ${fromIngredient} by ingredient`,
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCategory(nextCategory) {
    setCategory(nextCategory)
    setShowSaved(false)
    if (!nextCategory) {
      loadFeatured()
      return
    }
    setLoading(true)
    setError('')
    try {
      const results = await filterByCategory(nextCategory)
      setMeals(results)
      setHeading(nextCategory)
      setMeta(`${results.length} recipes in this category.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function surpriseMe() {
    setError('')
    try {
      const meal = await getRandomMeal()
      if (meal) setSelectedId(meal.idMeal)
    } catch (err) {
      setError(err.message)
    }
  }

  function toggleFavorite(meal) {
    setFavorites((current) => {
      const exists = current.some((item) => item.idMeal === meal.idMeal)
      if (exists) return current.filter((item) => item.idMeal !== meal.idMeal)
      return [snapshot(meal), ...current]
    })
  }

  function addReview(mealId, review) {
    setReviews((current) => ({
      ...current,
      [mealId]: [review, ...(current[mealId] ?? [])],
    }))
  }

  const displayed = showSaved ? favorites : meals

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage via-sage to-copper">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(247,239,228,0.18),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(224,122,79,0.35),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1>
              <Logo />
            </h1>
            <p className="mt-3 max-w-xl text-cream/85">
              Search by dish or what’s already in the fridge. Open a recipe for the full method,
              then leave a note for the next cook.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={surpriseMe}
              className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-sage-deep"
            >
              Surprise me
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSaved(true)
                setHeading('Your pantry saves')
                setMeta(
                  favorites.length
                    ? 'Recipes you bookmarked while browsing.'
                    : 'Heart a recipe to keep it here.',
                )
              }}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-cream ring-1 ring-white/30"
            >
              Saved ({favorites.length})
            </button>
          </div>
        </header>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={(event) => {
            event.preventDefault()
            runSearch(query, cuisine)
          }}
          cuisine={cuisine}
          onCuisineChange={(value) => {
            setCuisine(value)
            runSearch(query, value)
          }}
          areas={areas}
          loading={loading}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {PANTRY.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item)
                runSearch(item, cuisine)
              }}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-cream ring-1 ring-white/20 hover:bg-white/20"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <CategoryPills
            categories={categories}
            active={category}
            onSelect={handleCategory}
          />
        </div>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="font-display text-3xl text-cream">{heading}</h2>
            <p className="text-cream/80">{meta}</p>
          </div>
          {error && (
            <p className="mb-4 rounded-2xl bg-cream px-4 py-3 text-copper">{error}</p>
          )}
          {loading && !showSaved ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl bg-white/15"
                />
              ))}
            </div>
          ) : (
            <RecipeGrid
              meals={displayed}
              favorites={favoriteIds}
              onOpen={(meal) => setSelectedId(meal.idMeal)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </section>
      </div>

      {selectedId && (
        <RecipeModal
          mealId={selectedId}
          onClose={() => setSelectedId(null)}
          favorite={favoriteIds.includes(selectedId)}
          onToggleFavorite={toggleFavorite}
          reviews={reviews}
          onAddReview={addReview}
        />
      )}
    </div>
  )
}
