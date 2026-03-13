// Loading skeleton for flashcard grid - Light theme
export default function FlashcardSkeleton() {
  return (
    <div className="cyber-flashcard-page">
      <div className="cyber-skeleton">
        {/* Header skeleton */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 300, height: 32, borderRadius: 8 }} className="cyber-shimmer" />
          <div style={{ width: 200, height: 16, borderRadius: 6, marginTop: 8 }} className="cyber-shimmer" />
        </div>

        {/* Stats skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 80, borderRadius: 12 }} className="cyber-shimmer" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="mystery-bag-grid">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ aspectRatio: '3/4', borderRadius: 12 }} className="cyber-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
