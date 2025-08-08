# Azael Montejo Jr. - Blog

This is an efficient modular blog structure built with React and organized for easy maintenance and scalability.

## Structure

```
blog/
├── index.html              # Main blog page
├── components/             # React components
│   ├── Header.js          # Navigation header
│   ├── BlogPostCard.js    # Blog post preview cards
│   ├── FullBlogPost.js    # Full blog post view
│   ├── Footer.js          # Footer component
│   └── App.js             # Main app component (optional)
├── data/                  # Data files
│   └── blogPosts.js       # Blog posts data
├── styles/                # Stylesheets
│   └── blog.css           # Blog-specific styles
└── README.md              # This file
```

## Features

- **Modular Architecture**: Components are separated into individual files for easy maintenance
- **React-based**: Uses React for dynamic functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Easy Content Management**: Blog posts are stored in a separate data file
- **SEO Friendly**: Clean HTML structure and semantic markup

## Adding New Blog Posts

To add a new blog post, edit `data/blogPosts.js` and add a new post object to the array:

```javascript
{
    id: 'unique-post-id',
    title: "Your Post Title",
    date: "January 1, 2025",
    category: "Category Name",
    excerpt: "Brief excerpt of your post...",
    fullContent: `<p>Your full HTML content here...</p>`
}
```

## Technologies Used

- React 18
- Tailwind CSS
- Babel (for JSX transformation)
- Inter font family

## Access

The blog is accessible at: `https://azaelmontejo.com/blog/`