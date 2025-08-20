export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
  try {
    console.log('[Step 1] リクエスト受信');

    const { to, subject, userData, now, url, url1 } = await req.json();
    console.log('[Step 2] JSONパース完了:', { to, subject, userData, now, url, url1 });

    if (!to || !subject || !userData || !now || !url || !url1) {
      console.warn('[Step 3] 必須フィールドが不足しています');
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    console.log('[Step 4] nodemailerトランスポート作成');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    console.log('[Step 5] メール送信開始');
    const data = await transporter.sendMail({
      from: `"南高祭" <your_verified_gmail@gmail.com>`,
      to,
      subject,
      html: `
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
      `.trim(),
    });

    console.log('送信結果:', {
  accepted: data.accepted,
  rejected: data.rejected,
  response: data.response,
});
    return NextResponse.json({ message: '成功', data }, { status: 200 });
  } catch (error) {
    console.error('[Step X] メール送信エラー:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { message: '送信失敗', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
};