import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import articlesData from '../data/articles.json';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const sorted = [...articlesData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setArticles(sorted);
  }, []);

  const categories = ['All', ...new Set(articlesData.map((a) => a.category))];

  const filtered =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const handleArticleClick = (article) => {
    if (article.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-[#FFF2E8] border border-[#FFD6B8] rounded-full px-3 py-1 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFB27D]" />
          <span className="text-xs font-bold text-[#E67E4D] uppercase tracking-wider">Writing</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#2C3E50] mb-3">Articles</h1>
        <p className="text-gray-400 text-lg">
          Thoughts, tutorials, and insights on web development & software craft.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-[#FFB27D] text-[#2C3E50] shadow-md shadow-[#FFB27D]/30'
                : 'bg-white text-gray-400 border border-gray-100 hover:border-[#FFD6B8] hover:text-[#2C3E50]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => handleArticleClick(article)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl font-semibold text-gray-400">No articles yet</p>
        </div>
      )}
    </div>
  );
}
