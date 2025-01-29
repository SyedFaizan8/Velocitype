"use client"

import React, { useState } from 'react';
import leaderboardData from './leaderboard.json';

const page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = leaderboardData.leaderboard.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(leaderboardData.leaderboard.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col h-full w-full items-center p-5 bg-gray-100 text-black rounded-lg shadow-lg">
            {currentUsers.map((user) => (
                <div key={user.rank} className="flex items-center bg-white rounded-lg shadow-md my-2 p-4 w-full max-w-xl">
                    <img src={user.dp} alt={user.userName} className="rounded-full w-12 h-12 mr-4" />
                    <div className="flex flex-col">
                        <p><strong>Rank:</strong> {user.rank}</p>
                        <p><strong>Username:</strong> {user.userName}</p>
                        <p><strong>WPM:</strong> {user.wpm}</p>
                        <p><strong>Accuracy:</strong> {user.accuracy}%</p>
                        <p><strong>Time:</strong> {new Date(user.timeDate).toLocaleString()}</p>
                    </div>
                </div>
            ))}
            <div className="flex items-center mt-5"></div>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-blue-500 text-white px-4 py-2 mx-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                Previous
            </button>
            <span className="text-lg"> Page {currentPage} of {totalPages} </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white px-4 py-2 mx-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                Next
            </button>
        </div>
    );
};

export default page;
