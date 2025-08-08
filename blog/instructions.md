# Instructions for Adding New Blog Posts

## Purpose
This file provides step-by-step instructions for Cursor (or any AI coding assistant) to safely add a new blog post to the existing blog structure in `/website/blog/`. The goal is to ensure that:
- New posts are added without deleting, modifying, or overriding any existing posts.
- The blog maintains a modular structure.
- Posts are displayed in reverse chronological order (newest on top) on the blog homepage.
- The addition is seamless, requiring only edits to `/data/blogPosts.js` and potentially minor updates to `index.html` for sorting if not already present.
- No other files (e.g., components, styles, or index.html beyond sorting logic) are changed unless explicitly needed for compatibility.

**Important Rules**:
- **Never delete or modify existing posts**: Always append or insert the new post into the `blogPosts` array without touching old entries.
- **Preserve order and integrity**: If sorting isn't implemented, add it. Do not reorder the array manually—let sorting handle hierarchy.
- **Unique IDs**: Assign a new, unique ID by incrementing the highest existing ID by 1.
- **Date Handling**: Use the current date in YYYY-MM-DD format for the new post's `date` field. If the date is not provided in the user's input, default to today's date.
- **Content Extraction**: The user will paste the new post content after invoking these instructions. Parse it to extract: title, category (if provided, else default to "Insights"), excerpt (first 300 characters of content), and full content.
- **Error Handling**: If the user's pasted content is malformed (e.g., no title), prompt for clarification instead of proceeding.
- **Testing**: After making changes, suggest testing the blog locally (e.g., via Live Server) to confirm the new post appears correctly without breaking existing ones.
- **Version Control**: Assume the project is under Git. Commit changes with a message like "Added new blog post: [Title]".

## Prerequisites
- The blog structure must exist in `/website/blog/` with:
  - `index.html`: Main entry point with React app.
  - `/data/blogPosts.js`: Exports a `const blogPosts = [...]` array of post objects.
  - `/components/`: Contains Header.js, BlogPostCard.js, FullBlogPost.js, Footer.js, etc.
- If `/data/blogPosts.js` doesn't exist or is empty, create it with an empty array: `const blogPosts = [];`.
- Ensure React, Tailwind, and Babel are loaded in `index.html` as per the original setup.

## Step-by-Step Process for Adding a New Post

1. **Read the User's Input**:
   - The user will say something like: "I want you to post this to my blog. Read instructions.md for instructions on how to build it right." followed by the new post content.
   - Parse the pasted content. Assume it's in Markdown or plain text format. Extract:
     - **Title**: The first line starting with `# ` (H1) or the first bolded line. If none, use the first sentence as title.
     - **Date**: If provided (e.g., "Date: YYYY-MM-DD"), use it. Otherwise, use today's date (query the system date if needed, or hardcode if in a static context).
     - **Category**: If mentioned (e.g., "Category: Tech"), use it. Default to "Insights".
     - **Excerpt**: Automatically generate as the first 300 characters of the content (trimmed to the nearest word) + '...'.
     - **Content**: The full body. Convert Markdown to HTML if necessary (e.g., use `<p>` for paragraphs, `<strong>` for bold), but keep it as a string that can be rendered in FullBlogPost.js (which likely uses `dangerouslySetInnerHTML` or similar for HTML content).
   - Example User Input Parsing:
     - Input: "# My New Post\nCategory: AI\nThis is the content..."
     - Extracted: Title = "My New Post", Category = "AI", Content = "This is the content...", Excerpt = "This is the content..." (trimmed).

2. **Open and Analyze /data/blogPosts.js**:
   - Load the file.
   - Find the `blogPosts` array.
   - Determine the next ID: Find the maximum `id` in the array (or 0 if empty), then add 1.
   - Do not modify any existing objects in the array.

3. **Create the New Post Object**:
   - Construct a new object like this:
     ```javascript
     {
       id: nextId,  // e.g., 3 if highest is 2
       title: "Extracted Title",
       date: "YYYY-MM-DD",  // e.g., "2025-07-31"
       category: "Extracted or Default Category",
       excerpt: "First 300 chars of content...",
       content: "Full content as string (with HTML if needed)"
     }
     ```
   - Append this object to the end of the `blogPosts` array. (Sorting will handle positioning later.)

4. **Implement or Verify Sorting in index.html**:
   - Open `index.html`.
   - Locate the `<script type="text/babel">` section with the App component.
   - Find the `{blogPosts.map(post => (...))}` line in the main render.
   - If sorting is not present, modify it to:
     ```jsx
     {blogPosts
       .slice()  // Create a copy to avoid mutating the original array
       .sort((a, b) => new Date(b.date) - new Date(a.date))  // Sort descending by date
       .map(post => (
         <BlogPostCard
           key={post.id}
           id={post.id}
           title={post.title}
           date={post.date}
           category={post.category}
           excerpt={post.excerpt.substring(0, 300) + '...'}  // This might already be in the card, but ensure consistency
           onReadMore={handleReadMore}
         />
       ))}
     ```
   - If sorting is already there, leave it unchanged.
   - Do not alter any other parts of index.html (e.g., imports, state, or other components).

5. **Save Changes**:
   - Save `/data/blogPosts.js` with the updated array.
   - Save `index.html` if sorting was added.
   - Do not touch other files like components or styles.

6. **Verify and Respond**:
   - Confirm the addition: "New post '[Title]' added successfully with ID [ID]. It will appear at the top if its date is the most recent."
   - Suggest: "Please test by loading the blog page locally or deploying. If issues, revert via Git."
   - If the post content includes images or links, remind to handle them (e.g., upload images to a /assets/ folder and reference URLs).

## Edge Cases
- **Empty Array**: If `blogPosts` is empty, start with ID 1.
- **Duplicate Titles/IDs**: Check for duplicate IDs (though incrementing prevents this). If title duplicates, proceed—titles don't need to be unique.
- **Invalid Date**: If parsed date is invalid, default to current date.
- **Long Content**: Ensure `content` is a single string; split into paragraphs with `\n` or HTML if needed.
- **No Content Provided**: Respond: "Please provide the post content including a title."
- **Adding Multiple Posts**: If user pastes multiple, process one at a time or ask to separate.

## Example Workflow
User: "I want you to post this to my blog. Read instructions.md... # Awesome AI Tips\nCategory: Tech\nBody text here..."

- Extract: Title="Awesome AI Tips", Date="2025-07-31", Category="Tech", Excerpt="Body text here...", Content="Body text here..."
- Next ID: Say 5 (if 4 exists).
- Append to array.
- Add sorting if missing.
- Done!