import { useState } from "react";
import Project1 from "./Project1.jsx"; // Explicitly added .jsx extension
import Project2 from "./Project2.jsx"; // Explicitly added .jsx extension
import Project3 from "./Project3.jsx"; // Explicitly added .jsx extension

export default function App() {
  // State to keep track of the currently active tab
  const [activeTab, setActiveTab] = useState("project1"); // Default to 'project1'

  // Function to render the content based on the active tab
  const renderContent = () => {
    // Adding a key to force re-mounting and trigger transitions
    switch (activeTab) {
      case "project1":
        return <Project1 key="project1-content" />;
      case "project2":
        return <Project2 key="project2-content" />;
      case "project3":
        return <Project3 key="project3-content" />;
      default:
        return <Project1 key="project1-content" />; // Fallback to Project1
    }
  };

  return (
    // Main container for the app, using Tailwind for full height and padding
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-2 mb-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Tab button for Home */}
        <button
          onClick={() => setActiveTab("project1")}
          className={`
            px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out transform
            ${
              activeTab === "project1"
                ? "bg-blue-600 text-white shadow-lg scale-100"
                : "bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800 hover:scale-105 active:scale-95"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto
          `}
        >
          Home
        </button>

        {/* Tab button for Concepts */}
        <button
          onClick={() => setActiveTab("project2")}
          className={`
            px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out transform
            ${
              activeTab === "project2"
                ? "bg-blue-600 text-white shadow-lg scale-100"
                : "bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800 hover:scale-105 active:scale-95"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto
          `}
        >
          Concepts
        </button>

        {/* Tab button for Patterns */}
        <button
          onClick={() => setActiveTab("project3")}
          className={`
            px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out transform
            ${
              activeTab === "project3"
                ? "bg-blue-600 text-white shadow-lg scale-100"
                : "bg-gray-100 text-gray-700 hover:bg-blue-200 hover:text-blue-800 hover:scale-105 active:scale-95"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto
          `}
        >
          Patterns
        </button>
      </div>

      {/* Content area, now larger and with a fade-in transition */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-6xl min-h-[600px] bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-16 transition-opacity duration-500 ease-in-out animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
}
