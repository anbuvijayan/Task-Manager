import React from 'react';

const TasksStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-4 overflow-x-auto" role="tablist" aria-label="Task status tabs">
      <div className="flex flex-wrap gap-2 min-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.label}
            tabIndex={activeTab === tab.label ? 0 : -1}
            className={`relative px-3 py-1.5 rounded-md transition text-xs md:text-sm font-medium whitespace-nowrap ${
              activeTab === tab.label
                ? 'text-blue-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            <span>{tab.label}</span>
            <span
              className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs ${
                activeTab === tab.label
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


export default TasksStatusTabs;
