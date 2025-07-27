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
          ここでは自分の情報が登録できます。<br></br>
          1:「名前」を登録（本名でないと編集権限のリクエストが受理されません）<br></br>
          2:「クラス」を登録（自分のクラスを選択）<br></br>
          3:登録する<br></br>
          ※管理者はこの情報を閲覧できます<br></br>
          ※アカウントの削除の申し出は展示の委員に申し出ください<br></br>
          <span className='text-red-400 text-xl'>編集権限のリクエストは別のページです</span>
        </p>
      </div>
    </div>
  );
};

export default ExplanationRequestEdit;