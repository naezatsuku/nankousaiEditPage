import React, { useState } from 'react';

const ExplanationRequestEdit: React.FC = () => {
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
          ここでは編集権限がリクエストできます。<br></br>
          1:「編集権限をリクエスト」をクリック<br></br>
          2:「編集したいクラス」を選択（基本的には自分のクラスを選択）<br></br>
          3:送信<br></br>
          4:管理者が編集権限を付与し、編集が可能となる。<br></br>
          ※管理者が最終的に編集権限を与えます。<br></br>
          ※もし希望のクラスが選択できないときは展示の委員にお知らせください。
        </p>
      </div>
    </div>
  );
};

export default ExplanationRequestEdit;