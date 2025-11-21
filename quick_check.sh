#!/bin/bash
echo "🔍 快速项目检查..."

echo "1. 关键文件检查:"
[ -f "index.html" ] && echo "✅ index.html" || echo "❌ index.html"
[ -f "styles/main.css" ] && echo "✅ styles/main.css" || echo "❌ styles/main.css"
[ -f "scripts/word-bank.js" ] && echo "✅ scripts/word-bank.js" || echo "❌ scripts/word-bank.js"
[ -f "scripts/drag-drop.js" ] && echo "✅ scripts/drag-drop.js" || echo "❌ scripts/drag-drop.js"
[ -f "scripts/app.js" ] && echo "✅ scripts/app.js" || echo "❌ scripts/app.js"

echo ""
echo "2. 文件大小检查:"
wc -c scripts/*.js | tail -1

echo ""
echo "3. HTML脚本顺序:"
grep -n "script src" index.html

echo "✅ 检查完成"
