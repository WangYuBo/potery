#!/bin/bash
echo "🔍 检查项目文件..."

echo "1. 检查scripts目录:"
ls -la scripts/

echo ""
echo "2. 检查word-bank.js内容:"
head -10 scripts/word-bank.js

echo ""
echo "3. 检查文件大小:"
wc -c scripts/word-bank.js scripts/app.js

echo ""
echo "4. 检查HTML文件脚本顺序:"
grep -n "script src" index.html

echo ""
echo "✅ 文件检查完成"