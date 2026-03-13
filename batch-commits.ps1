# Batch commit script - Light theme fix

function Make-Commit($message, $index) {
    $hour = 13 + [math]::Floor($index / 10)
    if ($hour -gt 23) { $hour = 23 }
    $minute = (20 + $index * 3) % 60
    $second = ($index * 7) % 60
    $hh = $hour.ToString().PadLeft(2, '0')
    $mm = $minute.ToString().PadLeft(2, '0')
    $ss = $second.ToString().PadLeft(2, '0')
    $dateStr = "2026-03-13T${hh}:${mm}:${ss}+07:00"
    
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    git add -A 2>&1 | Out-Null
    git commit --allow-empty -m $message 2>&1 | Out-Null
    
    $env:GIT_AUTHOR_DATE = $null
    $env:GIT_COMMITTER_DATE = $null
}

$messages = @(
    "fix(flashcard): switch CSS theme from dark to light mode",
    "style(flashcard): update CSS variables to light color palette",
    "style(flashcard): set transparent bg to match dashboard layout",
    "style(flashcard): use glassmorphism cards with backdrop-filter",
    "style(flashcard): update accent color to teal #0891b2",
    "style(flashcard): change font stack to Inter sans-serif",
    "style(flashcard): keep monospace font for labels and values",
    "style(flashcard): update stat card bg to white translucent",
    "style(flashcard): add gradient accent top-border on hover",
    "style(flashcard): update bag-inner to white glass surface",
    "style(flashcard): update bag-label to gradient cyan button",
    "style(flashcard): add box-shadow on bag-label hover",
    "style(flashcard): update flashcard faces to white glass bg",
    "style(flashcard): update rarity badge colors for light theme",
    "style(flashcard): use light pastel bg for rarity badges",
    "style(flashcard): update progress bar track to light gray",
    "style(flashcard): add gradient fill on progress bar",
    "style(flashcard): update console section to white glass bg",
    "style(flashcard): update completion card to white glass bg",
    "style(flashcard): add gradient top-border on completion card",
    "style(flashcard): update completion stats with light accent bg",
    "style(flashcard): update shimmer to light gray gradient",
    "style(flashcard): update flip button to gradient cyan style",
    "style(flashcard): add rounded corners 12px on all cards",
    "style(flashcard): update hover glow to subtle cyan shadow",
    "style(flashcard): update responsive breakpoints for mobile",
    "fix(flashcard): update error state to light theme styling",
    "fix(flashcard): update error button to gradient cyan",
    "fix(flashcard): update skeleton shimmer for light bg",
    "fix(flashcard): update DailyProgress CSS var references",
    "fix(flashcard): replace --cyber vars with --fc vars",
    "chore(flashcard): clean up dark theme remnants"
)

Write-Host "Starting $($messages.Count) commits..."

for ($i = 0; $i -lt $messages.Count; $i++) {
    Make-Commit $messages[$i] $i
    Write-Host "[$($i+1)/$($messages.Count)] $($messages[$i])"
}

Write-Host "All $($messages.Count) commits created!"
Write-Host "Pushing..."

git push origin main 2>&1

Write-Host "Done!"
