// Footer Component
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-12 rounded-t-lg">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-300">&copy; {new Date().getFullYear()} Azael Montejo Jr. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="https://www.linkedin.com/in/azael-montejo-jr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">LinkedIn</a>
                    <a href="https://www.instagram.com/azaelmontejojr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Instagram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 