import { NextPage } from 'next';
import Head from 'next/head';
import cn from 'classnames/bind';

import { AppLayout } from 'components/app-layout';
import { NewsList } from 'components/news-list';
import { MonthsAndYearsFilter } from 'components/months-and-years-filter';

import styles from './news.module.css';

const cx = cn.bind(styles);

interface INewsProps {
  metaTitle: string;
}
const News: NextPage<INewsProps> = (props: INewsProps) => {
  const {
    metaTitle,
  } = props;
  return (
    <AppLayout>
      <Head>
        <title>{metaTitle}</title>
      </Head>
      <h1 className={cx('title')}>
        Новости
      </h1>
      <MonthsAndYearsFilter className={cx('filter')} filterCallBack={() => {}}/>
      <NewsList newsCardData={[]}/>
    </AppLayout>
  );
};

export default News;
