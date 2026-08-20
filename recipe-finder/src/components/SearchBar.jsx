export default function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  cuisine,
  onCuisineChange,
  areas,
  loading,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-cream-soft/90 p-3 shadow-xl shadow-sage-deep/20 backdrop-blur md:flex-row md:items-center"
    >
      <label className="sr-only" htmlFor="recipe-search">
        Search recipes or ingredients
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-sage/10">
        <span className="text-lg" aria-hidden>
          ⌕
        </span>
        <input
          id="recipe-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search recipes or ingredients — e.g. pasta, garlic, salmon"
          className="w-full bg-transparent text-base text-sage-deep outline-none placeholder:text-sage/45"
        />
      </div>
      <select
        value={cuisine}
        onChange={(event) => onCuisineChange(event.target.value)}
        className="rounded-2xl bg-sage px-4 py-3 text-sm font-medium text-cream outline-none"
        aria-label="Filter by cuisine"
      >
        <option value="">All cuisines</option>
        {areas.map((area) => (
          <option key={area.strArea} value={area.strArea}>
            {area.strArea}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-copper px-6 py-3 text-sm font-semibold text-white shadow-md shadow-copper/40 transition hover:bg-copper-bright disabled:opacity-60"
      >
        {loading ? 'Searching…' : 'Find recipes'}
      </button>
    </form>
  )
}
