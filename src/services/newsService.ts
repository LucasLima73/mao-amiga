import { supabase } from '../utils/supabase';

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  image_url: string;
  language: string;
  search_term: string;
  categories?: string[];
  keywords?: string[];
  published_at?: string;
  relevance_score?: number;
  snippet?: string;
  source?: string;
  uuid?: string;
}

/**
 * Check if articles exist in Supabase for a specific language and search term
 */
export const getArticlesFromSupabase = async (language: string, searchTerm: string): Promise<NewsItem[]> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('language', language)
      .eq('search_term', searchTerm);

    if (error) {
      console.error('Erro ao buscar artigos do Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exceção ao buscar artigos do Supabase:', error);
    return [];
  }
};

/**
 * Compare API articles with database articles
 * Returns API articles if they are different, otherwise returns database articles
 */
export const compareAndGetArticles = async (
  apiArticles: NewsItem[] | null, 
  language: string, 
  searchTerm: string
): Promise<NewsItem[]> => {
  // If no API articles, return database articles
  if (!apiArticles || apiArticles.length === 0) {
    console.log('Sem artigos da API, buscando do Supabase...');
    return await getArticlesFromSupabase(language, searchTerm);
  }

  // Get database articles
  const dbArticles = await getArticlesFromSupabase(language, searchTerm);
  
  // If no database articles, save API articles and return them
  if (dbArticles.length === 0) {
    console.log('Sem artigos no Supabase, salvando artigos da API...');
    await saveArticlesToSupabase(apiArticles, language, searchTerm);
    return apiArticles;
  }

  // Check if API articles are different from database articles
  // Using URL as the unique identifier
  const dbUrls = new Set(dbArticles.map(article => article.url));
  const hasNewArticles = apiArticles.some(article => !dbUrls.has(article.url));

  // If there are new articles, save them and return API articles
  if (hasNewArticles) {
    console.log('Artigos diferentes encontrados, salvando novos artigos...');
    await saveArticlesToSupabase(apiArticles, language, searchTerm);
    return apiArticles;
  }

  console.log('Usando artigos do Supabase (sem alterações)');
  // Otherwise, return database articles
  return dbArticles;
}

export const saveArticlesToSupabase = async (
  articles: NewsItem[],
  language: string,
  searchTerm: string
): Promise<void> => {
  try {
    const articlesToSave = articles.map(article => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      image_url: article.image_url || '',
      language,
      search_term: searchTerm,
      categories: article.categories || [],
      keywords: article.keywords || [],
      published_at: article.published_at || null,
      relevance_score: article.relevance_score || null,
      snippet: article.snippet || '',
      source: article.source || '',
      uuid: article.uuid || undefined, // deixamos que o default do banco gere
    }));

    // Verifica duplicatas existentes no Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from('news_articles')
      .select('url')
      .eq('language', language)
      .eq('search_term', searchTerm);

    if (fetchError) {
      console.error('Erro ao verificar artigos existentes:', fetchError);
      return;
    }

    const existingUrls = new Set((existingData || []).map(item => item.url));
    const newArticles = articlesToSave.filter(article => !existingUrls.has(article.url));

    if (newArticles.length === 0) {
      console.log('Nenhum artigo novo para salvar.');
      return;
    }

    const { error: insertError } = await supabase
      .from('news_articles')
      .insert(newArticles);

    if (insertError) {
      console.error('Erro ao salvar artigos no Supabase:', insertError);
    } else {
      console.log(`✅ ${newArticles.length} artigos novos salvos com sucesso.`);
    }
  } catch (error) {
    console.error('Erro geral ao salvar artigos:', error);
  }
};
