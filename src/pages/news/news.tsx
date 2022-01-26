import Error from 'next/error';
import { useEffect, useState, useRef, useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import cn from 'classnames/bind';

import { AppLayout } from 'components/app-layout';
import { NewsList, NewsCardData } from 'components/news-list';
import { ArticleFilter } from 'components/article-filter';
import { fetcher } from 'shared/fetcher';
import { stringify } from 'shared/helpers/query-string';
import { MONTHS } from 'shared/constants/months';
import { useIntersect } from 'shared/hooks/use-intersect';
import { PaginatedNewsItemListList } from 'api-typings';

import styles from './news.module.css';

interface INewsProps {
  metaTitle: string;
  errorCode?: number,
  initialNews?: NewsCardData[],
}

const cx = cn.bind(styles);

const itemsPerRequest = 3;

// const currentMonth = new Date().getMonth() + 1;
// const currentYear = new Date().getFullYear();

const News: NextPage<INewsProps> = (props: INewsProps) => {
  const {
    metaTitle,
    errorCode,
    initialNews = [],
  } = props;

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [news, setNews] = useState<NewsCardData[]>(initialNews);
  const [offset, setOffset] = useState(0);
  const [allNewsShown, setAllNewsShown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastItemRef = useRef(null);

  const handleMonthChange = useCallback((value: string) => {
    // TODO: 🤬 избавиться от этого костыля: selectMonth !== 'Месяц'
    if (value && value !== 'Месяц') {
      setMonth(convertMonthToNumber(value));
    }
  }, []);

  const handleYearChange = useCallback((value: string) => {
    if (value && value !== 'Год') {
      setYear(Number(value));
    }
  }, []);

  const handleLastItemIntersect = () => {
    if (allNewsShown) {
      return;
    }

    setOffset((offset) => offset + itemsPerRequest);
  };

  const fetchNews = async () => {
    const data = await _fetchNews(month, year, offset);

    if (!data.next) {
      setAllNewsShown(true);
    }

    setNews((news) => [
      ...news,
      ...data.results ?? [],
    ]);
  };

  useIntersect(lastItemRef.current, handleLastItemIntersect);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    fetchNews();
  }, [offset]);

  if (errorCode) {
    return (
      <Error statusCode={errorCode}/>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>{metaTitle}</title>
      </Head>
      <h1 className={cx('title')}>
        Новости
      </h1>
      <ArticleFilter
        className={cx('filter')}
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      {/* TODO: переделать нейминг пропсов и полей интерфейса NewsCardData, который зачем-то дублирует тип openapi-схемы */}
      <NewsList newsCardData={news}/>
      <div ref={lastItemRef}/>
    </AppLayout>
  );
};

async function _fetchNews(month?: number, year?: number, offset?: number) {
  let data;

  try {
    data = await fetcher<PaginatedNewsItemListList>(`news/${stringify({ month, year, offset, limit: itemsPerRequest })}`);
  } catch (error) {
    // TODO: добавить редирект на 500
    throw error;
  }

  return data;
};

export const getServerSideProps: GetServerSideProps<INewsProps> = async () => {
  const {
    results,
  } = await _fetchNews();

  if (!results) {
    return ({
      errorCode: 500,
    });
  }

  return {
    props: {
      initialNews: results,
      // TODO: вот тут нужно дополнительно проверять, есть ли еще новости
    },
  };
};

function convertMonthToNumber(month: string) {
  return MONTHS.indexOf(month) + 1;
};

export default News;
