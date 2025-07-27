"use client"
import React, { useState } from 'react';

const ExplanationHandleClass: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 my-4">
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
        <p className="text-sm text-gray-600 ">
          ここでは展示の出店状況を管理できます<br></br>
          展示を削除したり追加したりするのが可能です<br />
          <span className=' text-black'>説明</span><br />
          1:Introductionは各クラスの詳細ページです。これがないとタイトルしか見れません<br />
          2:Foodは高校三年生や、料理部などのフードを扱う展示のクラスに付与してください<br />
          3:削除してしまうとすべてなくなります。<br />
          4:新たに展示を追加するときは、クラス名を入力し、さらに展示タイプを入力してください。
        </p>
      </div>
    </div>
  );
};

export default ExplanationHandleClass;