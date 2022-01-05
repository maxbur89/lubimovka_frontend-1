import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

// import { useRouter } from 'next/router';
// import { Url } from 'shared/types';

import { AppLayout } from 'components/app-layout/index';
import { ForPressHero } from 'components/for-press-hero';
import { ForPressPressReleasesView } from 'components/for-press-press-releases-view';
import { pressReleasesData, forPressProps, prPerson } from '../../mocks/data/forPress';
import { fetcher } from 'shared/fetcher';
import { Years, PressRelease } from 'api-typings';
import { convertMonthToNumber } from 'components/months-and-years-filter/utils/convertMonthToNumber';
import image from 'components/play-proposal-layout/image';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { pressRelease } from 'components/for-press-press-releases-view/assets/pressRelease';

// const router = useRouter();
// const { year } = router.query;

const fetchYears = async () => {
  let data;

  try {
    data = await fetcher<Years>('/info/festivals/years/');

  } catch (error) {
    return;
  }

  return data;
};

const fetchPressRelelaseInitial = async () => {
  let data;

  try {
    data = await fetcher<PressRelease>('/info/press-releases/');

  } catch (error) {
    return;
  }

  return data;
};

const fetchPressRelelaseSelected = async (year: Number) => {
  let data;

  try {
    data = await fetcher<PressRelease>(`/info/press-releases/?year=${year}`);

  } catch (error) {
    return;
  }

  return data;
};

export const getServerSideProps: GetServerSideProps = async () => {

  const years = await fetchYears();
  const pressReleaseInitial = await fetchPressRelelaseInitial();

  return {
    props: {
      years,
      pressReleaseInitial,
    },
  };
};

const ForPress = ({ years, pressReleaseInitial }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const pressRelease = pressReleaseInitial[0];

  const {
    image: cover,
    title,
    text: contents,
    ...rest
  } = pressRelease;

  const pressReleaseSelected = Object.assign (
    {
      cover,
      title,
      contents
    }
  );

  return (
    <AppLayout>
      <Head>
        <title>{forPressProps.metaTitle}</title>
      </Head>
      <ForPressHero data={{
        forPressHeroTitle: {
          title: forPressProps.title,
        },
        forPressHeroDescription: {
          description: forPressProps.description,
          link: forPressProps.link,
        },
        prPerson: {
          name: prPerson.name,
          nameDative: prPerson.nameDative,
          email: prPerson.email,
          role: prPerson.role,
          photo: prPerson.photo,
        }
      }}/>
      <ForPressPressReleasesView
        pressRelease={pressReleaseSelected}
        years={years.years}/>
    </AppLayout>
  );
};

export default ForPress;
