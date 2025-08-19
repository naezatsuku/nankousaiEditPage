import { NextResponse } from 'next/server';

import nodemailer from "nodemailer"

export const POST = async (req:Request)=>{


    try{
        const { to , subject ,userData , now , url,url1} = await req.json();
        if (!to || !subject || !userData || !now || !url || !url1) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        })
        const data = await transporter.sendMail({
          from: `南高祭`, // ← 固定送信元
          to,
          subject,
          html:`
                    <div style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 20px;">
                        <h2 style="color: #333;">南高祭のクラスページ更新のお知らせ</h2>
                        <p style="font-size: 16px; color: #555;">
                          ${now} に ${userData.class_id} の ${userData.name} がページを編集しました
                        </p>
                        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">
                            南高祭サイトへ訪れる
                        </a>
                        <a href="${url1}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">
                            編集サイトへ訪れる
                        </a>
                    </div>

                  `.trim()

        });

        return NextResponse.json({message:"成功",data},{status:200})
    }catch(error){
        console.error('メール送信エラー:', error);
        return NextResponse.json({ message: '送信失敗', error:JSON.stringify(error) }, { status: 500 });
    }


    
}