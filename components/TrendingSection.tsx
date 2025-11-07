export function TrendingSection() {
  const trending = [
    'REST APIs',
    'GraphQL',
    'Machine Learning',
    'Image Processing',
    'Text Generation',
    'Data APIs',
    'Webhooks',
    'Real-time APIs',
  ];

  return (
    <div className="bg-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-white text-xl font-semibold mb-4">Popular API Categories</h3>
        <div className="flex gap-3 flex-wrap">
          {trending.map((tag) => (
            <button
              key={tag}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
