#!/bin/bash

echo "🧪 开始测试现代诗生成器网站..."

# 检查必要文件
required_files=("index.html" "styles/main.css" "scripts/app.js" "scripts/word-bank.js" "scripts/drag-drop.js")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少必要文件: $file"
        exit 1
    fi
done

echo "✅ 所有必要文件都存在"

# 使用8080端口避免冲突
PORT=8080

# 启动测试服务器
echo "🚀 启动测试服务器在端口 $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 测试HTTP响应
echo "🌐 测试网站可访问性..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)

if [ "$response" -eq 200 ]; then
    echo "✅ 网站可正常访问 (HTTP 200)"
else
    echo "❌ 网站访问失败 (HTTP $response)"
    kill $SERVER_PID
    exit 1
fi

# 测试资源文件加载
resources=("styles/main.css" "scripts/app.js" "scripts/word-bank.js" "scripts/drag-drop.js")

for resource in "${resources[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/$resource")
    if [ "$response" -eq 200 ]; then
        echo "✅ 资源文件加载正常: $resource"
    else
        echo "❌ 资源文件加载失败: $resource"
        kill $SERVER_PID
        exit 1
    fi
done

# 检查HTML结构
echo "📄 检查HTML结构..."
if grep -q "现代诗生成器" index.html && grep -q "poetry-lines" index.html && grep -q "words-grid" index.html; then
    echo "✅ HTML结构完整"
else
    echo "❌ HTML结构不完整"
    kill $SERVER_PID
    exit 1
fi

# 停止服务器
kill $SERVER_PID

echo ""
echo "🎉 所有基础测试通过！"
echo ""
echo "接下来请手动测试："
echo "1. 运行: python3 -m http.server $PORT"
echo "2. 在浏览器中打开: http://localhost:$PORT"
echo "3. 测试以下功能："
echo "   - 点击字词添加到诗词区"
echo "   - 拖拽调整诗句顺序"
echo "   - 复制诗歌功能"
echo "   - 响应式布局"