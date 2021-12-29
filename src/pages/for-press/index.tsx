import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { AppLayout } from 'components/app-layout/index';
import { ForPressHero } from 'components/for-press-hero';
import { ForPressPressReleasesView } from 'components/for-press-press-releases-view';
import { pressReleasesData, forPressProps, prPerson } from '../../mocks/data/forPress';
import { fetcher } from 'shared/fetcher';
import { Years } from 'api-typings';

const fetchYears = async () => {
  let data;

  try {
    data = await fetcher<Years>('/info/festivals/years/');

  } catch (error) {
    return;
  }

  return data;
};

export const getServerSideProps: GetServerSideProps = async () => {

  const years = await fetchYears();

  return {
    props: {
      years,
    },
  };
};

const ForPress = ({ years }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      <ForPressPressReleasesView pressReleases={pressReleasesData.pressReleases} years={years.years}/>
    </AppLayout>
  );
};

export default ForPress;
