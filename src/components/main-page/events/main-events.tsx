import { FC } from 'react';
import classNames from 'classnames/bind';

import { AnnouncedPlayCard } from 'components/ui/announced-play-card';
import { IMainAfisha } from './main-events.props';

import styles from './main-events.module.css';

const cx = classNames.bind(styles);

export const MainEvents: FC<IMainAfisha> = ({ items }) => (
  <section className={styles.events}>
    <ul className={styles.content}>
      {
        items.map(item => (
          <li key={item.id} className={cx('list')}>
            <AnnouncedPlayCard
              id={item.id}
              date={item.date_time}
              title={item.event_body.name}
              dramatists ={item.event_body.team.Драматург}
              directors={item.event_body.team.Режиссёр}
              description={item.event_body.description}
              buttonLink={item.url}
              imageUrl={item.event_body.image}
              projectText={item.event_body.project_title && undefined}
              paid={item.paid}
            />
          </li>
        ))}
    </ul>
  </section>
);
