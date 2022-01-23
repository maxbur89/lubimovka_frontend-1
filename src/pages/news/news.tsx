import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import cn from 'classnames/bind';

import { AppLayout } from 'components/app-layout';
import { NewsList, NewsCardData } from 'components/news-list';
import { ArticleFilter } from 'components/article-filter';
import { fetcher } from 'shared/fetcher';
import { stringify } from 'shared/helpers/query-string';
import { MONTHS } from 'shared/constants/months';
import { PaginatedNewsItemListList } from 'api-typings';

import styles from './news.module.css';

const cx = cn.bind(styles);

interface INewsProps {
  metaTitle: string;
}

// const currentMonth = new Date().getMonth() + 1;
// const currentYear = new Date().getFullYear();

const News: NextPage<INewsProps> = (props: INewsProps) => {
  const { metaTitle } = props;
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [news, setNews] = useState<NewsCardData[]>([]);

  const handleMonthChange = (selectMonth: string) => {
    // TODO: 🤬 избавиться от этого костыля: selectMonth !== 'Месяц'
    if (selectMonth !== 'Месяц' && selectMonth !== undefined){
      setMonth(convertMonthToNumber(selectMonth));
    }
  };

  const handleYearChange = (selectYear: string) => {
    if (selectYear !== 'Год' && selectYear !== undefined){
      setYear(Number(selectYear));
    }
  };

  const fetchNews = async() => {
    let data;

    try {
      data = await fetcher<PaginatedNewsItemListList>(`news/${stringify({ month, year })}`);
    } catch (error) {
      // TODO: добавить редирект на 500
      throw error;
    }

    setNews(data.results ?? []);
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
    </AppLayout>
  );
};

export default News;

function convertMonthToNumber(month: string) {
  return MONTHS.indexOf(month) + 1;
};
