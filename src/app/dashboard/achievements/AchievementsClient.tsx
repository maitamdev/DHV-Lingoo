// Achievements Client Component — interactive achievement grid with animations
'use client';

import { useState, useMemo } from 'react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, RARITY_CONFIG, getAchievementProgress } from '@/lib/achievements';
import type { UserStats, UserAchievement, Achievement } from '@/lib/achievements';
import './achievements.css';

interface Props {
  stats: UserStats;
  userAchievements: UserAchievement[];
}

type CategoryFilter = 'all' | 'learning' | 'streak' | 'social' | 'mastery' | 'special';

export default function AchievementsClient({ stats, userAchievements }: Props) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedIds = useMemo(() => new Set(userAchievements.map(ua => ua.achievement_id)), [userAchievements]);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === filter);
    return list.sort((a, b) => {
      const aUnlocked = a.condition(stats) ? 1 : 0;
      const bUnlocked = b.condition(stats) ? 1 : 0;
      if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked;
      return getAchievementProgress(b, stats) - getAchievementProgress(a, stats);
    });
  }, [filter, stats]);

  const totalUnlocked = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
  const totalXP = ACHIEVEMENTS.filter(a => a.condition(stats)).reduce((s, a) => s + a.xpReward, 0);

  const rarityStats = {
    bronze: ACHIEVEMENTS.filter(a => a.rarity === 'bronze' && a.condition(stats)).length,
    silver: ACHIEVEMENTS.filter(a => a.rarity === 'silver' && a.condition(stats)).length,
    gold: ACHIEVEMENTS.filter(a => a.rarity === 'gold' && a.condition(stats)).length,
    platinum: ACHIEVEMENTS.filter(a => a.rarity === 'platinum' && a.condition(stats)).length,
    diamond: ACHIEVEMENTS.filter(a => a.rarity === 'diamond' && a.condition(stats)).length,
  };

  return (
    <div className="ach-page">
      {/* Header */}
      <div className="ach-header">
        <div className="ach-header-left">
          <h1 className="ach-title">🏆 Thành tựu</h1>
          <p className="ach-subtitle">{totalUnlocked}/{ACHIEVEMENTS.length} đã mở khóa</p>
        </div>
        <div className="ach-header-right">
          <div className="ach-xp-badge">+{totalXP} XP</div>
        </div>
      </div>

      {/* Rarity Summary */}
      <div className="ach-rarity-summary">
        {(Object.entries(RARITY_CONFIG) as [string, typeof RARITY_CONFIG[keyof typeof RARITY_CONFIG]][]).map(([key, config]) => (
          <div key={key} className="ach-rarity-pill" style={{ borderColor: config.border, background: config.bg }}>
            <span className="ach-rarity-dot" style={{ background: config.color }} />
            <span className="ach-rarity-count">{rarityStats[key as keyof typeof rarityStats]}</span>
            <span className="ach-rarity-label">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="ach-filters">
        <button className={`ach-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Tất cả
        </button>
        {(Object.entries(ACHIEVEMENT_CATEGORIES) as [CategoryFilter, typeof ACHIEVEMENT_CATEGORIES[keyof typeof ACHIEVEMENT_CATEGORIES]][]).map(([key, cat]) => (
          <button key={key} className={`ach-filter-btn ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="ach-grid">
        {filtered.map((achievement) => {
          const unlocked = achievement.condition(stats);
          const progress = getAchievementProgress(achievement, stats);
          const rarity = RARITY_CONFIG[achievement.rarity];
          const isNew = unlocked && !unlockedIds.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`ach-card ${unlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}`}
              style={{ borderColor: unlocked ? rarity.border : undefined }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="ach-card-icon" style={{ background: unlocked ? rarity.bg : undefined }}>
                <span className={unlocked ? '' : 'ach-locked-icon'}>{achievement.icon}</span>
              </div>
              <div className="ach-card-content">
                <h3 className="ach-card-title">{achievement.title}</h3>
                <p className="ach-card-desc">{achievement.description}</p>
                {!unlocked && (
                  <div className="ach-progress-bar">
                    <div className="ach-progress-fill" style={{ width: `${progress}%`, background: ACHIEVEMENT_CATEGORIES[achievement.category].color }} />
                  </div>
                )}
              </div>
              <div className="ach-card-meta">
                {unlocked ? (
                  <span className="ach-card-xp" style={{ color: rarity.color }}>+{achievement.xpReward} XP</span>
                ) : (
                  <span className="ach-card-progress">{progress}%</span>
                )}
                <span className="ach-card-rarity" style={{ color: rarity.color }}>{rarity.label}</span>
              </div>
              {isNew && <div className="ach-new-badge">MỚI</div>}
              {unlocked && <div className="ach-check">✓</div>}
            </div>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="ach-modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="ach-modal" onClick={e => e.stopPropagation()}>
            <div className="ach-modal-icon" style={{ background: RARITY_CONFIG[selectedAchievement.rarity].bg }}>
              {selectedAchievement.icon}
            </div>
            <h2 className="ach-modal-title">{selectedAchievement.title}</h2>
            <p className="ach-modal-desc">{selectedAchievement.description}</p>
            <div className="ach-modal-meta">
              <span style={{ color: RARITY_CONFIG[selectedAchievement.rarity].color }}>
                {RARITY_CONFIG[selectedAchievement.rarity].label}
              </span>
              <span>+{selectedAchievement.xpReward} XP</span>
              <span>{ACHIEVEMENT_CATEGORIES[selectedAchievement.category].icon} {ACHIEVEMENT_CATEGORIES[selectedAchievement.category].label}</span>
            </div>
            {!selectedAchievement.condition(stats) && (
              <div className="ach-modal-progress">
                <div className="ach-progress-bar large">
                  <div className="ach-progress-fill" style={{
                    width: `${getAchievementProgress(selectedAchievement, stats)}%`,
                    background: ACHIEVEMENT_CATEGORIES[selectedAchievement.category].color
                  }} />
                </div>
                <span>{getAchievementProgress(selectedAchievement, stats)}%</span>
              </div>
            )}
            <button className="ach-modal-close" onClick={() => setSelectedAchievement(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
// Grid layout with auto-fill columns
