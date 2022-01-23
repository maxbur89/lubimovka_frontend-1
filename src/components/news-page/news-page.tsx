import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames/bind';

import { NewsTitle } from './news-title';
import { NewsList } from './news-list';
import { MonthsAndYearsFilter } from 'components/months-and-years-filter';
import { NewsItemList, PaginatedNewsItemListList } from 'api-typings';
import { fetcher } from 'shared/fetcher';
import InfiniteScroll from 'react-infinite-scroll-component';

// import MockNewsData from './assets/mock-data-news.json';
import style from './news-page.module.css';

const cx = cn.bind(style);

interface INewsPageProps {
  setNews: (news: NewsItemList[] | undefined) => void;
  news: NewsItemList[];
  nextOnScroll: any;
  hasMoreOnScroll: any;
}

const fetchNewsListFiltered = async (month: number, year: number) => {
  let data;
  try {
    data = await fetcher<PaginatedNewsItemListList>(`/news?month=${month}&year=${year}`);
  } catch (error) {
    return;
  }
  return data;
};

export const NewsPage: FC<INewsPageProps> = (props: INewsPageProps): JSX.Element => {
  const {
    setNews,
    news,
    nextOnScroll,
    hasMoreOnScroll,
  } = props;

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();

  useEffect(() => {
    if (month !== undefined && year !== undefined) {
      fetchNewsListFiltered(month, year)
        .then(news => {
          setNews(news?.results);
        })
        .catch(error => error);
    }

  }, [year, month, setNews]);

  return (
    <>
      <NewsTitle title='Новости' />
      <MonthsAndYearsFilter className={cx('droplistСontainer')}
        filterCallBack={(month, year) => {
          setMonth(month);
          setYear(year);
        }} />
      <InfiniteScroll style={{ overflow: 'hidden' }}
        dataLength={news.length}
        next={nextOnScroll}
        hasMore={hasMoreOnScroll}
        loader={''}
      >
        <NewsList newsListData={news} />
      </InfiniteScroll>
    </>
  );
};
