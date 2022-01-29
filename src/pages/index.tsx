import { NextPage, InferGetStaticPropsType, GetStaticProps } from 'next';
import React, { useState, useEffect/* , useCallback */ } from 'react';
import Head from 'next/head';
import cn from 'classnames/bind';

import { Main, Partner } from 'api-typings';
import { fetcher } from 'shared/fetcher';
/* import { MainTitle } from 'components/main-page/title'; */
import { MainEvents } from 'components/main-page/events';
/* import { MainAside } from 'components/main-page/aside'; */
import { MainBanners } from 'components/main-page/banners';
import { MainPlatforms } from 'components/main-page/platforms';
/* import { MainShortList } from 'components/main-page/shortList'; */
import { MainArchive } from 'components/main-page/archive';
import { MainFirstScreen } from 'components/main-page/first-screen';
import { Partners } from 'components/partners';
import { AppLayout } from 'components/app-layout';
import useWindowDimensions from 'components/library-authors-page/useWindowDimensions';
import { main } from 'mocks/data/main';

import styles from './index.module.css';

const cx = cn.bind(styles);

const MainPage: NextPage = ({ data = main, partners }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { first_screen, afisha, /* blog, news, */ banners, places, video_archive/* , short_list */ } = data;
  const [displayFirstScreen, setDisplayFirstScreen] = useState(false);
  const { height } = useWindowDimensions();
  const [stickyHeader, setStickyHeader] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.pageYOffset > height) {
        setStickyHeader(true);
      } else {
        setStickyHeader(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [height]);

  useEffect(() => {
    first_screen && notEmptyKey(first_screen) && setDisplayFirstScreen(true);
  }, []);

  function notEmpty<T>(items: T[]) {
    return items && items.length !== 0;
  }

  function notEmptyKey<T>(items: T) {
    return Object.keys(items).length !== 0;
  }

  return (
    <div>
      {first_screen && notEmptyKey(first_screen) &&
        displayFirstScreen && <div className={cx('background')} style={{ backgroundImage: `url(${first_screen.url})` }}/>}
      <AppLayout
        hiddenPartners
        expandedHeader={!stickyHeader}
        stickyHeader={stickyHeader}
      >
        <Head>
          <title>Главная. Любимовка</title>
        </Head>
        <main className={cx('main')}>
          {first_screen && notEmptyKey(first_screen) && displayFirstScreen && <MainFirstScreen {...first_screen}/>}
          {/* {news ? <MainAside type="news" {...news}/> : <MainAside type="blog" {...blog}/>}
          {afisha && notEmptyKey(afisha) &&
          <div className={cx('wrapper')}>
            <MainTitle
              title={afisha.title}
              button_label={afisha.button_label}
              description={afisha.description}
            />
          </div>} */}
          {afisha && notEmpty(afisha.items) && <MainEvents {...afisha}/>}
          {banners && notEmpty(banners.items) && <MainBanners {...banners}/>}
          {/* {short_list && notEmpty(short_list.items) && <MainShortList {...short_list}/>} */}
          {places && notEmpty(places.items) && <MainPlatforms {...places}/>}
          {video_archive && <MainArchive {...video_archive}/>}
          {partners && notEmptyKey(partners) && <Partners {...partners}/>}
        </main>
      </AppLayout>

    </div>

  );
};

const fetchMain = async () => {
  try {
    return await fetcher<Main>('/main/');
  } catch (error) {
    return;
  }
};

const fetchPartners = async () => {
  try {
    const festival = await fetcher<Partner>('/info/partners/?type=festival');
    const info = await fetcher<Partner>('/info/partners/?type=info');
    return {
      festival,
      info
    };
  } catch (error) {
    return;
  }
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchMain();
  const partners = await fetchPartners();

  if (!data || !partners) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
      partners,
    },
  };
};

export default MainPage;
