import React, { FC } from 'react';
import Head from 'next/head';
import ArticleTitle from './article-title/article-title';
import { Section } from '../section';

import DataTitle from './assets/mock-data-title.json';
import DataPlays from './assets/mock-data-plays.json';
import DataPersons from './assets/mock-data-persons.json';
import ArticleText from './assets/mock-data-article-main-text.json';
import DataShare from './assets/mock-data-share.json';

import {BasicPlayCard, BasicPlayCardList, IBasicPlayCardProps} from '../ui/basic-play-card';
import {IPersonCardProps, PersonCard, PersonCardList} from '../ui/person-card';
import {padding} from 'polished';
import {ArticleMainText} from './article-maintext';
import ArticleShare from './article-share/article-share';
import {ImageSlider, TImageItem} from '../ui/image-slider';


interface IArticlePageProps {
  metaTitle: string;
  isBlog: boolean;
}

export const ArticlePage: FC<IArticlePageProps> = (props: IArticlePageProps) => {
  const {
    metaTitle,
    isBlog,
  } = props;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
      </Head>
      <main>
        <ArticleTitle
          isBlog={isBlog}
          title={DataTitle.title}
          description={DataTitle.description}
          date={DataTitle.date}
          imgLink={DataTitle.imgLink}
          author={DataTitle.author}
          authorLink={DataTitle.authorLink}
        />
        <ArticleMainText>
          {ArticleText.contents.map((item, idx) => {
            switch (item.content_type) {
            case 'preamble':
              return(<h6 key={idx}>{item.content_item.preamble}</h6>);
            case 'title':
              return(<h4 key={idx}>{item.content_item.title}</h4>);
            case 'quote':
              return(<blockquote key={idx}>{item.content_item.quote}</blockquote>);
            case 'text':
              return(<p key={idx}>{item.content_item.text}</p>);
            case 'imagesblock':
              return(<ImageSlider images={item.content_item.items as TImageItem[]}/>);
            }
          })}
        </ArticleMainText>
        <Section type={'plays'} title={'Заголовок блока с пьессами'} style={padding(120, 0, 54)}>
          <BasicPlayCardList>
            {(DataPlays as IBasicPlayCardProps[]).map((item, idx) => (
              <BasicPlayCard key={idx} {...item}/>
            ))}
          </BasicPlayCardList>
        </Section>
        <Section type={'persons'} title={'Заголовок блока с персонами'} style={padding(120, 0, 54)}>
          <PersonCardList>
            {(DataPersons as IPersonCardProps[]).map((item, idx) => (
              <PersonCard key={idx} {...item}/>
            ))}
          </PersonCardList>
        </Section>
        <ArticleShare
          isBlog={isBlog}
          authors={isBlog ? DataShare.authors : []}
          illustrators={isBlog ? DataShare.illustrators : []}
          photographers={isBlog ? DataShare.photographers : []}
        />
      </main>
      {/*<ArticleOther/>*/}
    </>
  );
};
