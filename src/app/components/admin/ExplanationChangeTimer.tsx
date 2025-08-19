import React, { useState } from 'react';

const ExplanationChangeEditors: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
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
        <p className="text-sm text-gray-900 ">
          ここでは生徒の権限を変更できます。<br></br>
          生徒削除は別のページです。<br />
          待ち時間編集権限リクエストを送った人のみ表示されます。<br />
          ※スマホだと一覧のみ閲覧可能です。<br />
          <span className='text-gray-600 font-bold'>viewer</span>:何も役割なし<br />
          <span className='text-blue-600 font-bold'>timer</span>:待ち時間の編集権限有り。<br />
          <span className=' text-black'>操作方法</span><br />
          1:ロールの部分をクリックし、任意の役職を選択<br />
          2:担当クラスの部分をクリックし、任意のクラスを選択<br />
          3:更新
        </p>
      </div>
    </div>
  );
};

export default ExplanationChangeEditors;