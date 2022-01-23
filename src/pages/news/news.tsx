import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import cn from 'classnames/bind';

import { AppLayout } from 'components/app-layout';
import { NewsList, NewsCardData } from 'components/news-list';
import { ArticleFilter } from 'components/article-filter';
import { fetcher } from 'shared/fetcher';
import { stringify } from 'shared/helpers/query-string';
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

function convertMonthToNumber(v: string) {
  let month:number = new Date().getMonth() + 1;

  switch (v) {
  case 'Январь':
    month = 1;
    break;
  case 'Февраль':
    month = 2;
    break;
  case 'Март':
    month = 3;
    break;
  case 'Апрель':
    month = 4;
    break;
  case 'Май':
    month = 5;
    break;
  case 'Июнь':
    month = 6;
    break;
  case 'Июль':
    month = 7;
    break;
  case 'Август':
    month = 8;
    break;
  case 'Сентябрь':
    month = 9;
    break;
  case 'Октябрь':
    month = 10;
    break;
  case 'Ноябрь':
    month = 11;
    break;
  case 'Декабрь':
    month = 12;
    break;
  }

  return month;
};
