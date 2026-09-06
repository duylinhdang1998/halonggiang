export function revealProgress(scrollTop, end) {
  if (!Number.isFinite(scrollTop) || !Number.isFinite(end) || end <= 0) return 0;
  return Math.max(0, Math.min(1, scrollTop / end));
}

export function activeChapter(scrollTop, positions, viewportHeight) {
  let active = 0;
  for (let index = 0; index < positions.length; index += 1) {
    if (scrollTop + viewportHeight * 0.45 >= positions[index]) active = index;
  }
  return active;
}
