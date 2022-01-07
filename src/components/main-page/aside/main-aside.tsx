import { FC } from 'react';
import cn from 'classnames/bind';

import { Button } from 'components/ui/button';
import { MainNews } from 'components/main-page/news';

import styles from './main-aside.module.css';
import data from '../assets/mock-data.json';

const cx = cn.bind(styles);

export const MainAside: FC = () => {
  const { title, buttonText, buttonLink } = data.aside;
  return (
    <section className={cx('container')}>
      <aside className={cx('aside')}>
        <div className={cx('heading')}>
          <h2 className={cx('title')}>{title}</h2>
          <div className={cx('buttonContainer')}>
            <Button
              label={buttonText}
              isLink
              href={buttonLink}
              width="100%"
              border="bottomLeft"
              iconPlace="left"
              icon="arrow-right"
              align="start"
              gap="9px"
              size="s"
              className={cx('button')}
            />
          </div>
        </div>

        <ul className={cx('list')}>
          <li>
            {<MainNews/>}
            {<MainNews/>}
            {<MainNews/>}
            {<MainNews/>}
          </li>
        </ul>
      </aside>
    </section>
  );
};
