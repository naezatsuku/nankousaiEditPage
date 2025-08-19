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
          ここでは各展示を編集した時の担任への通知メールの変更ができます<br></br>
          すべての展示が表示されます<br />
          ※パソコンのみ閲覧可能です。<br />
          <span className=' text-black'>操作方法</span><br />
          メールアドレスをクリックしてメールアドレスの変更を行う<br />
          ※<span className='text-red-500'>「固定」</span>をクリックすると、メールアドレスの変更の申請を拒否します。<br />
          展示の部の期間中など、メールアドレスを変更させたくないときに活用してください。<br />
          <span className="text-green-700 font-bold">緑色</span>...更新の申請があるクラス<br />
          <span className="text-red-700 font-bold">赤色</span>...更新を拒否している状態
        </p>
      </div>
    </div>
  );
};

export default ExplanationChangeEditors;