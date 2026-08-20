import { useState } from 'react'

function Stars({ value, onChange, readOnly = false }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`text-xl ${star <= value ? 'text-copper' : 'text-sage/25'} ${
            readOnly ? 'cursor-default' : 'hover:scale-110'
          }`}
          aria-label={`${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ mealId, reviews, onAddReview }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const mealReviews = reviews[mealId] ?? []
  const average =
    mealReviews.length === 0
      ? 0
      : mealReviews.reduce((sum, review) => sum + review.rating, 0) / mealReviews.length

  function handleSubmit(event) {
    event.preventDefault()
    if (!comment.trim()) return
    onAddReview(mealId, {
      id: crypto.randomUUID(),
      name: name.trim() || 'Guest cook',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    })
    setName('')
    setComment('')
    setRating(5)
  }

  return (
    <section className="border-t border-sage/10 pt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-sage-deep">Kitchen notes</h3>
          <p className="text-sm text-sage/70">
            {mealReviews.length === 0
              ? 'Be the first to review this plate.'
              : `${average.toFixed(1)} average · ${mealReviews.length} review${
                  mealReviews.length === 1 ? '' : 's'
                }`}
          </p>
        </div>
        {mealReviews.length > 0 && <Stars value={Math.round(average)} readOnly />}
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl bg-cream p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-xl bg-white px-3 py-2 outline-none ring-1 ring-sage/10"
          />
          <Stars value={rating} onChange={setRating} />
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="How did it turn out? Any swaps or tips?"
          rows={3}
          className="w-full rounded-xl bg-white px-3 py-2 outline-none ring-1 ring-sage/10"
          required
        />
        <button
          type="submit"
          className="rounded-xl bg-sage px-4 py-2 text-sm font-semibold text-cream hover:bg-sage-deep"
        >
          Post review
        </button>
      </form>

      <ul className="space-y-3">
        {mealReviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-white p-4 ring-1 ring-sage/10">
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className="font-medium text-sage-deep">{review.name}</p>
              <Stars value={review.rating} readOnly />
            </div>
            <p className="text-sm leading-relaxed text-sage/80">{review.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
