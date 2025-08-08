// Main App Component
const App = () => {
    const [selectedPostId, setSelectedPostId] = useState(null);

    const handleReadMore = (id) => {
        setSelectedPostId(id);
    };

    const handleBackToList = () => {
        setSelectedPostId(null);
    };

    const currentPost = blogPosts.find(post => post.id === selectedPostId);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="container mx-auto px-4 py-12 flex-grow">
                {selectedPostId ? (
                    <FullBlogPost post={currentPost} onBackToList={handleBackToList} />
                ) : (
                    <>
                        <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-900 leading-tight">My Latest Insights</h1>
                        {blogPosts.map(post => (
                            <BlogPostCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                date={post.date}
                                category={post.category}
                                excerpt={post.excerpt.substring(0, 300) + '...'}
                                onReadMore={handleReadMore}
                            />
                        ))}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default App;