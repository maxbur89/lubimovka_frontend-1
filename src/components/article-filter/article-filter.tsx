import { FC } from 'react';
import cn from 'classnames/bind';

import { Droplist } from 'components/ui/droplist';
import { MONTHS } from 'shared/constants/months';

import styles from './article-filter.module.css';

const cx = cn.bind(styles);

interface IArticleFilterProps {
  className?: string;
  month?: number;
  year?: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

const currentDate = new Date();

export const ArticleFilter: FC<IArticleFilterProps> = (props) => {
  const {
    className,
    month,
    year,
    onMonthChange,
    onYearChange,
  } = props;

  return (
    <div className={cx('root', className)}>
      <Droplist
        data={MONTHS}
        type="radio"
        defaultValue={'Месяц'}
        cb={([month]) => onMonthChange(month)}
        className={cx('droplistTypelistMonths')}
      />
      <span className={cx('error', 'errorMonth', { errorVisible: month === undefined && year })}>
        Выберите месяц
      </span>
      <Droplist
        data={createYearList()}
        type="radio"
        defaultValue={'Год'}
        cb={([year]) => onYearChange(year)}
        className={cx('droplistTypelistYears')}
      />
      <span className={cx('error', 'errorYear', { errorVisible: month !== undefined && !year })}>
        Выберите год
      </span>
    </div>

  );
};

function createYearList(): string[] {
  const yearList = [];

  let currentYear = currentDate.getFullYear();

  for (let i = 0; i < currentDate.getFullYear() - 2012; ++i) {
    yearList.push(String(currentYear--));
  }

  return yearList;
};
