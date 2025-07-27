import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react'
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
const ChangeRoleTables: React.FC = () => {
    const [data, setData] = useState<user_profile[]>();
    const fetchData = async () => {
            const { data: profiles, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq("request_edit",true);
                console.log(profiles)
            if (error) {
                console.log(error);
                return window.alert(`${error}が発生しました`);
            }
            if (profiles) {
                setData(profiles);
            }
        };
      
        useEffect(() => {
          fetchData();
        }, []);
  return (
    <div>
      
    </div>
  )
}

export default ChangeRoleTables