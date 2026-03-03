// Loading skeleton for flashcard grid
export default function FlashcardSkeleton() {
  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 16px' }} className="animate-shimmer" />
        <div style={{ width: 200, height: 24, background: '#e2e8f0', margin: '0 auto 8px', borderRadius: 4 }} className="animate-shimmer" />
        <div style={{ width: 160, height: 16, background: '#e2e8f0', margin: '0 auto', borderRadius: 4 }} className="animate-shimmer" />
      </div>
      <div className="mystery-bag-grid">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ aspectRatio: '3/4', background: '#e2e8f0', borderRadius: 16 }} className="animate-shimmer" />
        ))}
      </div>
    </div>
  );
}
