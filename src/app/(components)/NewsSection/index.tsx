import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import { t } from 'i18next';
import { NewsItem, compareAndGetArticles } from '../../../services/newsService';

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { i18n } = useTranslation();

  const searchTerms = {
    pt: 'imigrantes',
    en: 'refugees',
    es: 'refugiados',
    ar: 'مهاجرين',
    fr: 'refugiés',
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Get the current language and search term
        const currentLanguage = i18n.language;
        const searchTerm = searchTerms[currentLanguage as keyof typeof searchTerms];
        
        let apiArticles: NewsItem[] | null = null;
        
        try {
          // Try to fetch from API first
          const response = await fetch(
            `https://api.thenewsapi.com/v1/news/all?` +
              new URLSearchParams({
                search: searchTerm,
                language: currentLanguage,
                api_token: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
              })
          );
          console.log("response", response)
          const data = await response.json();
          
          if (data.data) {
            apiArticles = data.data;
          }
        } catch (apiError) {
          console.error('Error fetching news from API:', apiError);
          // We'll continue and try to get articles from Supabase
        }
        
        // Compare API articles with Supabase and get the appropriate articles to display
        const articlesToDisplay = await compareAndGetArticles(
          apiArticles, 
          currentLanguage, 
          searchTerm
        );
        
        setNews(articlesToDisplay);
        
      } catch (error: any) {
        console.error('Error in news fetching process:', error);
      }
    };

    fetchNews();
  }, [i18n.language]);

  return (
    <div className={styles.newsSection}>
      <h2>{t('newsSection.title')}</h2>
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
