export default function CategoryPills({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          active === ''
            ? 'bg-cream text-sage-deep shadow'
            : 'bg-white/15 text-cream hover:bg-white/25'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.idCategory}
          type="button"
          onClick={() => onSelect(category.strCategory)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === category.strCategory
              ? 'bg-cream text-sage-deep shadow'
              : 'bg-white/15 text-cream hover:bg-white/25'
          }`}
        >
          {category.strCategory}
        </button>
      ))}
    </div>
  )
}
