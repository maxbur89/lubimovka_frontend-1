import { useEffect, useState, useCallback } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { AppLayout } from 'components/app-layout/index';
import { NewsPage } from 'components/news-page';
import { NewsItemList, PaginatedNewsItemListList } from 'api-typings';
import { fetcher } from 'shared/fetcher';

const News = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [news, setNews] = useState<Array<NewsItemList> | undefined>(props.results);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState<number>(0);


  const getNumberOfNews = async () => {
    fetchNewsList(0, 0)
      .then(dataNumbers => {
        const countOfNews = dataNumbers?.count;
        return Number(countOfNews);
      }).then(dataNumbers => {
        setCount(dataNumbers);
      })
  }

  const getMoreNews = async () => {
    setOffset(offset + 3)
    fetchNewsList(3, offset)
      .then(data => {
        const results = data?.results;

        if (!news && !results)
          return [];

        if (!news)
          return results;

        if (!results)
          return news;

        return news.concat(results)
      }).then(data => {
        setNews(data)
      })
      .catch(error => error)
  }


  useEffect(() => {
    console.log(count)
    console.log(news?.length)
    getNumberOfNews()
    if (news) {
      setHasMore(count > news.length ? true : false)
    }
  }, [news, count])

  return (
    <AppLayout>
      <NewsPage
        setNews={setNews}
        news={news || []}
        nextOnScroll={getMoreNews}
        hasMoreOnScroll={hasMore}
      />
    </AppLayout>
  );
};

const fetchNewsList = async (limit: number, offset: number) => {
  let data;
  try {
    data = await fetcher<PaginatedNewsItemListList>(`/news?limit=${limit}&offset=${offset}`);
  } catch (error) {
    return;
  }
  return data;
};

export const getServerSideProps: GetServerSideProps<PaginatedNewsItemListList> = async () => {

  const newsList = await fetchNewsList(3, 0);

  if (!newsList) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...newsList
    },
  };
};

export default News;
