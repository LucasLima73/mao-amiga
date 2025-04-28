import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  image_url: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { i18n } = useTranslation();

  const searchTerms = {
    pt: 'imigrantes',
    en: 'refugees',
    es: 'refugiados',
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://api.thenewsapi.com/v1/news/all?` +
            new URLSearchParams({
              search: searchTerms[i18n.language as keyof typeof searchTerms],
              language: i18n.language,
              api_token: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
            })
        );
        
        const data = await response.json();
        
        if (!data.data) {
          throw new Error(data.message || "Erro ao buscar notícias");
        }
        
        setNews(data.data);
        
      } catch (error: any) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [i18n.language]);

  return (
    <div className={styles.newsSection}>
      <h2>Últimas Notícias</h2>
      <div className={styles.newsGrid}>
        {news.slice(0, 4).map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.newsCard}
          >
            <div className={styles.imageContainer}>
              <img
                src={item.image_url || '/assets/images/news-placeholder.jpg'}
                alt={item.title}
                className={styles.newsImage}
              />
            </div>
            <div className={styles.newsContent}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
