Project Plan: The Spirit Constellation
Objective: To transform the 3D Spirit Constellation prototype into a scalable, modular, and content-driven web application, seamlessly integrated into azaelmontejo.com.
Phase 0: The Architecture - A Modern Approach
We will build this using a Headless CMS architecture. This is the key to making the system dynamic and easy to update.
The Frontend (The Fox): This is the 3D visualization code we've built. It will live in its own organized folder (/Blog/) and will be responsible only for displaying the data.
The Backend (The Brain): This will be a Headless Content Management System (CMS). This is your database and dashboard, all in one. It's where you will log in to write, edit, and create new nodes (insights and topics) without ever touching the code. The frontend will ask the backend for the latest content every time someone visits the page.
For the backend, I recommend Sanity.io. It's incredibly powerful, has a generous free tier, and gives you a beautiful, customizable dashboard (called the Sanity Studio) out of the box.
Phase 1: Backend - Building Your Content Engine with Sanity.io
This is where we define the structure of your knowledge.
1.1. Setup Sanity Studio:
You will set up a new Sanity.io project. This will give you a local "Studio" – a web application that you can run on your computer to manage content and then deploy.
1.2. Define the Content Schemas:
This is the most critical step. We tell your dashboard what kind of content it needs to manage. We'll create two main types: Topic and Insight.
File: schemas/topic.js
// Defines the major nodes in your constellation (the "body parts" of the fox)
export default {
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string', // e.g., "Systems Thinking"
    },
    {
      name: 'group',
      title: 'Fox Body Part',
      type: 'string', // e.g., "Head", "Body", "Legs", "Tail"
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text', // A brief summary of the topic.
    },
  ],
}


File: schemas/insight.js
// Defines the smaller nodes - your actual articles and ideas.
export default {
  name: 'insight',
  title: 'Insight',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string', // e.g., "The Pri-Fly Feedback Loop"
    },
    {
      name: 'parentTopic',
      title: 'Parent Topic',
      type: 'reference', // This is how we connect an insight to a topic
      to: [{type: 'topic'}],
    },
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent', // A rich text editor for writing your full article.
    },
    {
      name: 'crossConnections',
      title: 'Cross-Connections',
      type: 'array', // Allows you to link this insight to other insights
      of: [{type: 'reference', to: {type: 'insight'}}],
    },
  ],
}


Result: You will have a secure, online dashboard where you can simply "Create New Insight," write your article, pick its Parent Topic from a dropdown menu, and publish.
Phase 2: Frontend - Modularizing the Constellation
We will break the single HTML file into a clean, professional file structure inside /home/monte/website/Blog.
2.1. New File Structure:
/home/monte/website/Blog/
|
|-- index.html              # The main HTML shell
|
|-- css/
|   |-- main.css            # All the styling
|
|-- js/
|   |-- main.js             # The main script that starts everything
|   |
|   |-- modules/
|   |   |-- sceneSetup.js   # Sets up the Three.js camera, renderer, lights
|   |   |-- dataService.js  # Fetches data from your Sanity.io backend
|   |   |-- constellation.js# Creates the 3D nodes and links
|   |   |-- interaction.js  # Handles all user interaction (clicks, zoom, etc.)
|
|-- assets/
    |-- (any images or other files you might need)


2.2. Logic of the Modules:
main.js: Imports all other modules and runs them in the correct order.
dataService.js: Contains the logic to query the Sanity.io API to get all your topics and insights.
sceneSetup.js: Creates the 3D world.
constellation.js: Takes the data from dataService and builds the 3D fox.
interaction.js: Makes the fox interactive.
Phase 3: Homepage Integration
We need to add a link to your new "Spirit Constellation" on azaelmontejo.com in a way that feels intentional and clean.
Analysis: Your current homepage is a sleek, professional, single-page design. The best place for this link is in the main header navigation, positioning it as a core part of your identity alongside your projects.
Action:
Edit the index.html file of azaelmontejo.com.
Locate the header navigation section.
Add a new link. It should look something like this:
<!-- In your azaelmontejo.com index.html file -->
<nav>
  <a href="#about">About</a>
  <a href="#projects">Projects</a>
  <a href="/EXOBOUND/">EXOBOUND</a>
  
  <!-- ADD THIS NEW LINK -->
  <a href="/Blog/">Spirit Constellation</a> 
  
  <a href="#contact">Contact</a>
</nav>


Note: The exact structure may vary, but the goal is to add a new <a> tag pointing to the /Blog/ directory.
This plan provides a complete roadmap. It creates a system that is not only visually stunning but also robust, scalable, and easy for you to manage long-term. This is how you build a project that lasts.
