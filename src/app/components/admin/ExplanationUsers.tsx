import React, { useState } from 'react';

const ExplanationUsers: React.FC = () => {
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
          open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-600 ">
          ここでは生徒一覧の閲覧・生徒の削除ができます。編集リクエストした人のみの変更は別ページです。<br></br>
          ※スマホだと一覧のみ閲覧可能です。<br />
          赤色は管理者権限有り。青色は編集者権限有り。緑色は待ち時間更新のみ編集権限有り
        </p>
      </div>
    </div>
  );
};

export default ExplanationUsers;