import mark from '../assets/hearth-logo.png'

export default function Logo({ compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      <img
        src={mark}
        alt="Hearth"
        className={`rounded-2xl object-cover shadow-lg shadow-sage-deep/30 ring-2 ring-cream/70 ${
          compact ? 'h-10 w-10' : 'h-16 w-16 sm:h-20 sm:w-20'
        }`}
      />
          {!compact && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cream/80">
                Modern kitchen
              </span>
              <span className="mt-1 block font-display text-5xl leading-none text-cream sm:text-6xl">
                Hearth
              </span>
            </div>
          )}
    </div>
  )
}
