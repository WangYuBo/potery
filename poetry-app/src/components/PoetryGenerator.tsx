import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { getRandomWords } from '@/data/wordBank';

interface PoetryLine {
  id: string;
  words: string[];
}

interface DragItem {
  lineId: string;
  wordIndex: number;
  word: string;
}

export default function PoetryGenerator() {
  const [availableWords, setAvailableWords] = useState<string[]>(getRandomWords());
  const [poetryLines, setPoetryLines] = useState<PoetryLine[]>([
    { id: 'line-1', words: [] }
  ]);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const dragWordRef = useRef<string | null>(null);

  const refreshWords = () => {
    setAvailableWords(getRandomWords());
  };

  const addWordToLine = (word: string, lineId: string) => {
    setPoetryLines(lines =>
      lines.map(line =>
        line.id === lineId
          ? { ...line, words: [...line.words, word] }
          : line
      )
    );
  };

  const removeWordFromLine = (lineId: string, wordIndex: number) => {
    setPoetryLines(lines =>
      lines.map(line =>
        line.id === lineId
          ? { ...line, words: line.words.filter((_, i) => i !== wordIndex) }
          : line
      )
    );
  };

  const addNewLine = () => {
    const newLineId = `line-${Date.now()}`;
    setPoetryLines(lines => [...lines, { id: newLineId, words: [] }]);
  };

  const clearAll = () => {
    setPoetryLines([{ id: 'line-1', words: [] }]);
  };

  const copyPoetry = async () => {
    const poetry = poetryLines
      .filter(line => line.words.length > 0)
      .map(line => line.words.join(''))
      .join('\n');

    try {
      await navigator.clipboard.writeText(poetry);
      alert('诗歌已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, word: string) => {
    dragWordRef.current = word;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, lineId: string) => {
    e.preventDefault();
    const word = dragWordRef.current;
    if (word) {
      addWordToLine(word, lineId);
      dragWordRef.current = null;
    }
  };

  const handleWordDragStart = (e: React.DragEvent, lineId: string, wordIndex: number, word: string) => {
    setDraggedItem({ lineId, wordIndex, word });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleWordDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWordDrop = (e: React.DragEvent, targetLineId: string, targetWordIndex: number) => {
    e.preventDefault();

    if (!draggedItem) return;

    if (draggedItem.lineId === targetLineId) {
      // 同一行内移动
      setPoetryLines(lines =>
        lines.map(line => {
          if (line.id !== targetLineId) return line;

          const newWords = [...line.words];
          const [movedWord] = newWords.splice(draggedItem.wordIndex, 1);
          newWords.splice(targetWordIndex, 0, movedWord);

          return { ...line, words: newWords };
        })
      );
    } else {
      // 跨行移动
      setPoetryLines(lines =>
        lines.map(line => {
          if (line.id === draggedItem.lineId) {
            return {
              ...line,
              words: line.words.filter((_, i) => i !== draggedItem.wordIndex)
            };
          }
          if (line.id === targetLineId) {
            const newWords = [...line.words];
            newWords.splice(targetWordIndex, 0, draggedItem.word);
            return { ...line, words: newWords };
          }
          return line;
        })
      );
    }

    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            现代诗生成器
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            点击或拖拽字词，创作属于你的现代诗
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Poetry Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                我的诗歌
              </h2>

              <div className="space-y-4">
                {poetryLines.map((line) => (
                  <div
                    key={line.id}
                    className={`min-h-[80px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                      line.words.length === 0
                        ? 'border-gray-300 dark:border-gray-600'
                        : 'border-gray-400 dark:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, line.id)}
                  >
                    {line.words.length === 0 ? (
                      <div className="text-gray-400 text-center h-full flex items-center justify-center">
                        拖拽字词到这里...
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {line.words.map((word, wordIndex) => (
                          <span
                            key={`${line.id}-${wordIndex}`}
                            className="poetry-word inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-4 py-2 rounded-lg cursor-move hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            draggable
                            onDragStart={(e) => handleWordDragStart(e, line.id, wordIndex, word)}
                            onDragOver={handleWordDragOver}
                            onDrop={(e) => handleWordDrop(e, line.id, wordIndex)}
                            onClick={() => removeWordFromLine(line.id, wordIndex)}
                            title="点击删除或拖拽移动"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={copyPoetry} className="flex-1">
                  复制诗歌
                </Button>
                <Button variant="outline" onClick={addNewLine} className="flex-1">
                  换行
                </Button>
                <Button variant="destructive" onClick={clearAll} className="flex-1">
                  清空重来
                </Button>
              </div>
            </div>
          </div>

          {/* Words Area */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                可选字词
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 max-h-[500px] overflow-y-auto">
                {availableWords.map((word, index) => (
                  <div
                    key={index}
                    className="word-grid-item bg-gradient-to-br from-purple-500 to-blue-500 text-white px-3 py-2 rounded-lg text-center text-sm font-medium hover:from-purple-600 hover:to-blue-600"
                    draggable
                    onDragStart={(e) => handleDragStart(e, word)}
                    onClick={() => {
                      const firstEmptyLine = poetryLines.find(line => line.words.length === 0) || poetryLines[0];
                      if (firstEmptyLine) {
                        addWordToLine(word, firstEmptyLine.id);
                      } else {
                        addWordToLine(word, poetryLines[poetryLines.length - 1].id);
                      }
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={refreshWords} className="w-full">
                刷新字词
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <p>现代诗生成器 - 创作你的诗意</p>
        </div>
      </div>
    </div>
  );
}
