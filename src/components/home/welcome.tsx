import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type WelcomeProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundUrl?: string;
};

const Welcome: React.FC<WelcomeProps> = ({
  title = 'ようこそ',
  description = 'ここではての編集を行うことができます。',
  ctaLabel = '展示一覧へ',
  onCtaClick,
  backgroundUrl = '/homeBackGround.png',
}) => {
return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
      
      <div className="absolute inset-0 -z-20 filter brightness-90">
        <Image
          src={backgroundUrl}
          alt="背景画像"
          fill
          style={{ objectFit: 'cover' }}
          placeholder="empty"
          sizes="100vw"
          priority
        />
      </div>

      
      <div className="absolute inset-0 -z-10 bg-black/20" />

      
      <div className="relative z-10 max-w-xl w-full p-8 bg-white/30 backdrop-blur-md rounded-xl shadow-lg text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl drop-shadow-md mb-8">
          {description}
        </p>
        <div className="flex flex-col justify-center gap-4">
          <Link
            href="/viewer"
            scroll={false}
            className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-100 transition-colors"
          >
            {ctaLabel}
          </Link>
          <div
            className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-100 transition-colors"
          >
            <a href="#class-list">クラス一覧へ</a>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
