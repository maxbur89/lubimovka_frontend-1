import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames/bind';
import Image from 'next/image';

import { Url } from 'shared/types';
import { Droplist } from 'components/ui/droplist';
import { Button } from 'components/ui/button';
import { useMediaQuery } from 'shared/hooks/use-media-query';
import breakpoints from 'shared/breakpoints.js';

import styles from './for-press-press-releases-view.module.css';

const cx = cn.bind(styles);

export interface IForPressPressReleasesViewProps {
  pressReleases: PressRelease[],
  years: number[],
}

type PressRelease = {
  year: number,
  cover: Url,
  downloadLink: Url,
  title: string,
  contents: string,
}

export const ForPressPressReleasesView: FC<IForPressPressReleasesViewProps> = (props) => {

  const pressReleaseYears = props.years.sort((a, b) => b - a);
  const pressReleaseDefaultYear = pressReleaseYears[0];
  const [pressReleaseYearSelected, setPressReleaseYearSelected] = useState<string[] | number>(pressReleaseDefaultYear);
  const pressReleaseSelected = props.pressReleases.find(i => i.year === pressReleaseYearSelected);

  const isMobile = useMediaQuery(`(max-width: ${breakpoints['tablet-portrait']})`);

  useEffect(() => {
    setPressReleaseYearSelected(pressReleaseYearSelected);
  }, [ pressReleaseYearSelected, isMobile ]);

  return (
    <section className={cx('main')}>
      <h3 className={cx('title')}>
        Пресс-релизы
      </h3>
      <nav className={cx('navigation')}>
        <p className={cx('droplistLabel')}>
          Выберите год фестиваля
        </p>
        <Droplist
          type='radio'
          data={pressReleaseYears}
          cb={(i: string[]) => {
            setPressReleaseYearSelected(Number(i));
          }}
          className={cx('droplist')}
          defaultValue={pressReleaseDefaultYear.toString()}
        />
        <Button
          view='primary'
          className={cx('button')}
          align='center'
          gap='11px'
          size='s'
          border='bottomLeft'
          iconPlace='right'
          icon='arrow-down'
          label={pressReleaseSelected === undefined ?
            'Пресс-релиз не найден'
            : pressReleaseSelected !== undefined && isMobile
              ? 'Скачать пресс-релиз в .pdf'
              : `Скачать пресс-релиз ${pressReleaseYearSelected} года в .pdf`}
          isLink={pressReleaseSelected !== undefined}
          disabled={pressReleaseSelected === undefined}
          href={pressReleaseSelected !== undefined ? pressReleaseSelected.downloadLink : ''}
        />
      </nav>
      {pressReleaseSelected && pressReleaseSelected.cover !== null &&
        <div className={cx('coverContainer')}>
          <div className={cx('cover')}>
            <Image
              layout="fill"
              objectFit="cover"
              src={pressReleaseSelected.cover}
              alt={pressReleaseYearSelected ? `Обложка фестиваля ${pressReleaseYearSelected} года` :
                'Обложка фестиваля не найдена'}
            />
          </div>
        </div>
      }
      {
        pressReleaseSelected === undefined ?
          <p className={cx('notFound')}>Пресс-релиз этого года не найден</p>
          :
          <article className={cx('pressReleaseText')}>
            <p className={cx('preamble')}>{pressReleaseSelected.title}</p>
            <div dangerouslySetInnerHTML={{ __html: pressReleaseSelected.contents }}/>
          </article>
      }
    </section>
  );
};
