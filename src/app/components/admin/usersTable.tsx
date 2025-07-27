import Loading from '@/components/global/parts/loading';
import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
type user_profile = {
  user_id: string;
  name: string;
  class_id: string;
  role: string;
  requestEdit: boolean | null;
  requestTargetClass: string | null;
  TargetEditClass: string | null;
  email: string;
  created_at: string | null;
  updated_at: string | null;
};

const UsersTable = () => {
    const [data, setData] = useState<user_profile[]>();
    const [selectedUser, setSelectedUser] = useState<user_profile | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleCheckboxChange = (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    };
    const handleDeleteSelected = async () => {
        console.log(selectedIds);
        if(!window.confirm("ほんとにユーザーを削除しますか？")){
          return;
        }
        if (selectedIds.length === 0) return;
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .in('user_id', selectedIds);

        if (error) {
            alert('削除に失敗しました');
        } else {
            fetchData(); 
            setSelectedIds([]); 
            alert("削除に成功しました")
            window.location.reload()
        }
    };

    const fetchData = async () => {
        const { data: profiles, error } = await supabase
            .from('user_profiles')
            .select('*');
        if (error) {
            return window.alert('errorが発生しました');
        }
        if (profiles) {
            setData(profiles);
        }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const getRowColorClass = (role: string) => {
    switch (role) {
        case 'admin':
          return 'bg-red-50';
        case 'editor':
          return 'bg-blue-50';
        case 'viewer':
          return 'bg-gray-50';
        default:
          return '';
    }
    };
  
    return (
      
      <div className="w-full px-4 py-6 text-gray-700 overflow-x-auto">
        <div className='flex justify-center my-2 '>
            <button
            onClick={()=>{
                if(selectedIds.length == 0){
                    return window.alert("削除する生徒を選択してください")
                }
                handleDeleteSelected()
            }}
            className='py-2 px-3 border-none rounded-2xl bg-red-100 '
            >
                選択したユーザーを削除（{selectedIds.length}）
            </button>
        </div>
        {!data ?  
        <Loading></Loading>
            :
        <table className="w-full border-collapse rounded-t text-xs sm:text-sm">
<thead className="bg-gray-100 text-left font-medium">
  <tr>
    <th className="px-2 py-2 hidden sm:table-cell">削除</th>
    <th className="px-3 py-2">氏名</th>
    <th className="px-3 py-2">クラス</th>
    <th className="px-3 py-2 hidden sm:table-cell">メール</th>
    <th className="px-3 py-2 hidden sm:table-cell">現在担当</th>
    <th className="px-3 py-2 hidden sm:table-cell">ロール</th>
    <th className="px-3 py-2 hidden sm:table-cell">編集リクエスト</th>
    <th className="px-3 py-2 hidden sm:table-cell">希望クラス</th>
    <th className="px-3 py-2">詳細</th>
  </tr>
</thead>
  <tbody>
{data.map((user, index) => (
  <tr
    key={index}
    className={`border-t border-gray-200 transition ease-in-out ${getRowColorClass(user.role)}`}
  >
    <td className="px-2 py-2 text-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(user.user_id)}
              onChange={() => handleCheckboxChange(user.user_id)}
            />
    </td>
    <td className="px-3 py-2">{user.name ?? '未設定'}</td>
    <td className="px-3 py-2">{user.class_id ?? '未設定'}</td>
    <td className="px-3 py-2 hidden sm:table-cell">{user.email ?? '未設定'}</td>
    <td className="px-3 py-2 hidden sm:table-cell">{user.TargetEditClass ?? '未設定'}</td>
    <td className="px-3 py-2 hidden sm:table-cell">{user.role ?? '未設定'}</td>
    <td className="px-3 py-2 hidden sm:table-cell">
      {user.requestEdit != null
        ? user.requestEdit ? '申請中' : 'なし'
        : '未設定'}
    </td>
    <td className="px-3 py-2 hidden sm:table-cell">{user.requestTargetClass ?? '未設定'}</td>
    <td
      className="px-3 py-2 text-blue-600 underline cursor-pointer"
      onClick={() => setSelectedUser(user)}
    >
      詳細
    </td>
  </tr>
))}
  </tbody>
      
        </table>            
        }                                                 
        <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedUser(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <motion.div
            className="bg-white p-4 rounded-lg shadow-xl w-[90%] max-w-xs sm:max-w-sm text-center"
          >
            <h3 className="text-base font-bold mb-3">日時情報</h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>作成日時: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '未設定'}</p>
              <p>更新日時: {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleString() : '未設定'}</p>
            </div>
            <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setSelectedUser(null)}
          >
            閉じる
          </button>
          </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
      </div>
    );
  };
  
export default UsersTable;