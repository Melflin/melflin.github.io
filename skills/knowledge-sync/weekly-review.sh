#!/bin/bash
# Knowledge Sync - Weekly Review Script
# Usage: Run manually or add to cron
# 
# Cron setup (every Sunday at 10:00):
#   crontab -e
#   0 10 * * * /Users/melf/GitMelflin/skills/knowledge-sync/weekly-review.sh

cd /Users/melf/GitMelflin/skills/knowledge-sync

echo "📚 Weekly Knowledge Review"
echo "=========================="
echo ""

# Show books from last 30 days
echo "📖 Books read recently:"
node review.js 30

echo ""
echo "💡 Next steps:"
echo "   1. Open Obsidian"
echo "   2. Check 'Bücher' folder"
echo "   3. Add highlights & notes to recent books"
echo "   4. Add new book: node index.js add --title '...' --author '...'"
