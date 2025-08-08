// Blog Post Card Component (for snippets)
const BlogPostCard = ({ id, title, date, category, excerpt, onReadMore }) => {
    return (
        <article className="bg-white rounded-xl shadow-lg p-6 mb-8 transition transform duration-200 hover:scale-[1.01] hover:shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">{date} | {category}</p>
            <p className="text-gray-700 leading-relaxed mb-6">{excerpt}</p>
            <button
                onClick={() => onReadMore(id)}
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md py-1 px-2"
            >
                Read More
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
        </article>
    );
};

export default BlogPostCard; 