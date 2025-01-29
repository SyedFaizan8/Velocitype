import React from 'react';

const InformationPage: React.FC = () => {
    return (
        <div className="p-5 font-sans">
            <h1 className="text-2xl font-bold mb-4">Welcome to Velocity Typing</h1>
            <p className="mb-4">
                Velocity Typing is a platform designed to help you improve your typing speed and accuracy. Inspired by websites like Monkeytype, our tools and resources are here to help you achieve your goals.
            </p>

            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <p className="mb-4">
                Our platform offers a variety of features to enhance your typing skills:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Real-time performance tracking</li>
                <li>Detailed analytics and reports</li>
                <li>Competitive leaderboards</li>
                <li>Personalized practice sessions</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-4">
                We would love to hear from you! If you have any questions, suggestions, or feedback, please feel free to contact us at:
            </p>
            <p className="mb-2">Email: <a href="mailto:contact@velocitytyping.com" className="text-blue-500">contact@velocitytyping.com</a></p>
            <p>Phone: (123) 456-7890</p>

            <h2 className="text-xl font-semibold mb-2">Contribute</h2>
            <p className="mb-4">
                We welcome contributions from the community! If you are interested in contributing to Velocity Typing, please visit our <a href="https://github.com/velocitytyping" className="text-blue-500">GitHub repository</a> for more information on how to get started.
            </p>
        </div>
    );
};

export default InformationPage;
