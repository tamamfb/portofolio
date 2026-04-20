import { Clock, ArrowUpRight } from 'lucide-react';

export default function ArticleCard({ article, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <div className="bg-white/90 text-[#2C3E50] px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <ArrowUpRight size={12} /> Read Article
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Top meta */}
        <div className="flex justify-between items-center mb-3">
          <time className="text-xs text-gray-400 font-medium">
            {formatDate(article.date)}
          </time>
          <span className="bg-[#FFF2E8] text-[#E67E4D] border border-[#FFD6B8] px-2.5 py-0.5 rounded-full text-xs font-bold">
            {article.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#2C3E50] mb-2 leading-snug group-hover:text-[#E67E4D] transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {article.readTime}
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {article.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#FFF8F4] text-[#2C3E50] border border-[#FFE8D6] px-2 py-0.5 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#FFB27D] to-[#FFC499] transition-all duration-500 rounded-b-xl" />
    </div>
  );
}
