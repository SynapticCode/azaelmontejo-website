Game Plan: Website Update & Integration
Phase 1: Website Structure & Organization
This phase sets up the correct file structure.

Create the Portfolio Directory:

Action: In your main website folder (/home/monte/website/), create a new folder named Portfolio.

Resulting Path: /home/monte/website/Portfolio/

Create the Portfolio File:

Action: Inside the new Portfolio folder, create a new HTML file. Let's name it index.html. Using index.html is a good practice because navigating to azaelmontejo.com/Portfolio/ will automatically load this page.

Resulting Path: /home/monte/website/Portfolio/index.html

Phase 2: Update the Portfolio Page with Corrected Styles
This phase fixes the color and font issues you noticed. I've adjusted the color palette to restore the high-contrast, deep blue theme and make the text much clearer and less grey.

Action: Copy the entire code block below and place it into the new /home/monte/website/Portfolio/index.html file you just created.

I'm updating the document with the corrected styles. The key changes are in the <style> section to enhance contrast and readability.

Phase 3: Integrate the Link into Your Main Page
This is the final step. You need to add a link to your new portfolio in the navigation bar of your main homepage (/home/monte/website/index.html).

Where to place it: The best place is in your main navigation menu, alongside "Home," "EXOBOUND," and "Blog." This makes it prominent and easy for visitors to find.

Action: Open your main homepage file (/home/monte/website/index.html). Find the <nav> or navigation section in your code. Add the following line of code inside that navigation list.

HTML

<!-- Add this line to your main page's navigation menu -->
<a href="/Portfolio/" class="text-gray-300 link-hover">Portfolio</a>
For context, it should look something like this (your exact code might vary):

HTML

<!-- Example of what your navigation bar code might look like after editing -->
<nav>
    <!-- ... other navigation elements ... -->
    <div class="hidden md:flex items-center space-x-6 text-sm">
        <a href="/" class="text-gray-300 link-hover">Home</a>
        <a href="/EXOBOUND/" class="text-gray-300 link-hover">EXOBOUND</a>
        
        <!-- THIS IS THE NEW LINK YOU ARE ADDING -->
        <a href="/Portfolio/" class="text-gray-300 link-hover">Portfolio</a>
        <!-- END OF NEW LINK -->

        <a href="/Blog/" class="text-gray-300 link-hover">Blog</a>
    </div>
    <!-- ... -->
</nav>
Once you complete these three phases, your website will be perfectly updated. You'll have a dedicated, well-styled portfolio that showcases your skills, all neatly organized within your site's structure.