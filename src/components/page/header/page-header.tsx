import { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './page-header.module.css';

interface IPageHeaderProps {
  sticky?: boolean,
  expanded?: boolean,
}

const cx = classNames.bind(styles);

export const PageHeader: FC<IPageHeaderProps> = (props) => {
  const {
    sticky,
    expanded,
    children,
  } = props;

  return (
    <header className={cx('header', { expanded }, { sticky })}>
      {children}
    </header>
  );
};
