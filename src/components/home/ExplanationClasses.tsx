"use client"
import React, { useState } from 'react';

const ExplanationClasses: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto my-3 bg-white rounded-xl shadow-md p-6 border-1 border-slate-400">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition"
      >
        説明 {open ? '▲' : '▼'}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden mt-2 ${
          open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-md text-gray-600 ">
          ここではクラス一覧の編集ページに移動できます。<br></br>
          
          <span className='text-red-400 text-lg'>展示出しているのにない！？という方は展示の委員に申し出ください</span>
        </p>
      </div>
    </div>
  );
};

export default ExplanationClasses;