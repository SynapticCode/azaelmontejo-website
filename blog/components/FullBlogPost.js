// Full Blog Post Component
const FullBlogPost = ({ post, onBackToList }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <button
                onClick={onBackToList}
                className="inline-flex items-center text-gray-600 font-semibold hover:text-gray-800 transition duration-200 mb-6 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded-md py-1 px-2"
            >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Blog
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-md text-gray-500 mb-6">{post.date} | {post.category}</p>
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.fullContent }}>
            </div>
        </div>
    );
};

export default FullBlogPost; 