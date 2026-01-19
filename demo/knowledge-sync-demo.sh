#!/bin/bash
# Demo script for Knowledge Sync

echo '$ knowledge-sync add "Atomic Habits" "James Clear" "Habit stacking: After I pour coffee, I will write 3 things I'"'"'m grateful for."'
sleep 0.5
echo '✅ Added to Obsidian: knowledge/books/atomic-habits-james-clear.md'
sleep 0.3
echo ''
echo '$ knowledge-sync add "Atomic Habits" "James Clear" "2-minute rule: When starting a new habit, it should take less than 2 minutes."'
sleep 0.5
echo '✅ Updated existing note with new insight'
sleep 0.3
echo ''
echo '$ knowledge-sync list --this-month'
sleep 0.5
echo '📚 Knowledge Captured (January 2026):'
sleep 0.2
echo '├── Atomic Habits (James Clear) - 5 insights'
sleep 0.2
echo '├── Deep Work (Cal Newport) - 3 insights'
sleep 0.2
echo '├── The Mom Test (Rob Fitzpatrick) - 7 insights'
sleep 0.2
echo '└── Total: 15 insights across 3 books'
sleep 0.3
echo ''
echo '$ _'
