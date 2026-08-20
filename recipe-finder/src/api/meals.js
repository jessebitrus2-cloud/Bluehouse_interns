const API_KEY = import.meta.env.VITE_MEALDB_API_KEY || '1'
const VERSION = API_KEY === '1' ? 'v1' : 'v2'
const BASE = `https://www.themealdb.com/api/json/${VERSION}/${API_KEY}`

async function getJson(path) {
  const response = await fetch(`${BASE}${path}`)
  if (!response.ok) {
    throw new Error('Could not reach TheMealDB. Try again in a moment.')
  }
  return response.json()
}

export async function searchByName(query) {
  const data = await getJson(`/search.php?s=${encodeURIComponent(query)}`)
  return data.meals ?? []
}

export async function filterByIngredient(query) {
  const data = await getJson(`/filter.php?i=${encodeURIComponent(query)}`)
  return data.meals ?? []
}

export async function lookupMeal(id) {
  const data = await getJson(`/lookup.php?i=${encodeURIComponent(id)}`)
  return data.meals?.[0] ?? null
}

export async function getCategories() {
  const data = await getJson('/categories.php')
  return data.categories ?? []
}

export async function filterByCategory(category) {
  const data = await getJson(`/filter.php?c=${encodeURIComponent(category)}`)
  return data.meals ?? []
}

export async function getAreas() {
  const data = await getJson('/list.php?a=list')
  return data.meals ?? []
}

export async function filterByArea(area) {
  const data = await getJson(`/filter.php?a=${encodeURIComponent(area)}`)
  return data.meals ?? []
}

export async function getRandomMeal() {
  const data = await getJson('/random.php')
  return data.meals?.[0] ?? null
}

export async function getFeaturedMeals(count = 8) {
  const meals = await Promise.all(
    Array.from({ length: count }, () => getRandomMeal()),
  )
  const unique = new Map()
  meals.filter(Boolean).forEach((meal) => unique.set(meal.idMeal, meal))
  return [...unique.values()]
}

export function mealIngredients(meal) {
  const items = []
  for (let i = 1; i <= 20; i += 1) {
    const name = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (name) items.push({ name, measure: measure || '' })
  }
  return items
}

export async function searchRecipes(query) {
  const trimmed = query.trim()
  if (!trimmed) return { meals: [], fromName: 0, fromIngredient: 0 }

  const [byName, byIngredient] = await Promise.all([
    searchByName(trimmed),
    filterByIngredient(trimmed),
  ])

  const merged = new Map()
  byName.forEach((meal) => {
    merged.set(meal.idMeal, { ...meal, matchType: 'recipe' })
  })
  byIngredient.forEach((meal) => {
    if (!merged.has(meal.idMeal)) {
      merged.set(meal.idMeal, { ...meal, matchType: 'ingredient' })
    }
  })

  return {
    meals: [...merged.values()],
    fromName: byName.length,
    fromIngredient: byIngredient.length,
  }
}
