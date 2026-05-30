# Sharper v2 Restore Point

This file marks the Sharper v2 restore point before new look-and-feel experiments.

## Label
Sharper v2

## Date
2026-05-30

## Main restore commit
f55d61e39dcac56412f104178e3816fbd2ba2af1

## What this version includes
- Supabase-backed live cards loaded into Sharp.
- Daily card batches instead of an accumulating Today list.
- Saved cards appended at the bottom of Today.
- “Next day (editor mode)” behavior.
- Swipe-back panel motion.
- Detail cards open at top.
- Swipe-back returns to previous Today scroll position.
- Pull-down refresh feedback pill.
- Hidden top status bar/time/icons.
- Smaller sans-serif typography.
- Horizontal scroll and zoom locked.

## Revert instruction
To restore Sharper v2, reset main to commit:

```bash
git reset --hard f55d61e39dcac56412f104178e3816fbd2ba2af1
git push --force-with-lease origin main
```

Alternatively, restore from branch:

```bash
git checkout sharper-v2
```
