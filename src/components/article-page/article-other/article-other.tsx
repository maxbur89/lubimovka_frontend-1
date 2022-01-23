import React from 'react';
import cn from 'classnames/bind';

import { NewsList } from 'components/news-list';
import { BlogList } from 'components/ui/blog-card/list';
import { BlogCard } from 'components/ui/blog-card';
import { BlogItem, NewsItem } from 'shared/types';

import styles from './article-other.module.css';

const cx = cn.bind(styles);

interface IArticleOtherProps {
  blogArticle?: BlogItem[];
  newsArticle?: NewsItem[];
}

export const ArticleOther: React.FC<IArticleOtherProps> = (props) => {
  const {
    blogArticle = [],
    newsArticle = [],
  } = props;

  return (
    <section className={cx('container', { newsListContainer: newsArticle.length > 0 })}>
      <h2 className={cx('sectionTitle', { newsListTitle: newsArticle.length > 0 })}>Другие {blogArticle.length > 0 ? 'записи' : 'новости'}</h2>
      {blogArticle.length > 0 ?
        <BlogList>
          {blogArticle.map(item => (
            <BlogCard
              key={item.id}
              image={item.image}
              author={item.author_url_title}
              heading={item.title}
              description={item.description}
              id={item.id}
            />
          ))}
        </BlogList>:
        <NewsList newsCardData={newsArticle} className={cx('newsList')}/>
      }

    </section>
  );
};
