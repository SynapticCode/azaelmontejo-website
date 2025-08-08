// Header Component
const Header = () => {
    return (
        <header className="bg-white shadow-md py-4 rounded-b-lg">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <a href="https://azaelmontejo.com" className="text-2xl font-bold text-gray-800 rounded-lg p-2 hover:bg-gray-100 transition duration-300">Azael Montejo Jr.</a>
                <nav className="mt-4 md:mt-0">
                    <ul className="flex flex-wrap justify-center space-x-4 md:space-x-8">
                        <li><a href="https://azaelmontejo.com" className="text-gray-600 hover:text-blue-600 font-medium rounded-lg p-2 transition duration-300">Home</a></li>
                        <li><a href="https://azaelmontejo.com/EXOBOUND/" className="text-gray-600 hover:text-blue-600 font-medium rounded-lg p-2 transition duration-300">Research</a></li>
                        <li><a href="https://amjcoaching.com/services" className="text-gray-600 hover:text-blue-600 font-medium rounded-lg p-2 transition duration-300">Services</a></li>
                        <li><a href="https://amjcoaching.com/contact-me" className="text-gray-600 hover:text-blue-600 font-medium rounded-lg p-2 transition duration-300">Contact</a></li>
                        <li><a href="#" className="text-blue-600 font-bold rounded-lg p-2 bg-blue-50 hover:bg-blue-100 transition duration-300">Blog</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header; 