import React, { useState } from 'react';

const ExplanationEditAdmin: React.FC = () => {
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
        <p className="text-sm text-gray-900 ">
          ここでは生徒の権限を管理者に変更できます。<br></br>
          ほかのページでは管理者に変更はできません<br />
          ※自分の役職も変更可能です<br />
          <span className=' text-black'>操作方法</span><br />
          1:クラス組番号と名前を入力※一語一句同じでないと見つかりません<br />
          2:検索！<br />
          3:生徒の情報が出てくるので、役職を変更<br />
        </p>
      </div>
    </div>
  );
};

export default ExplanationEditAdmin;