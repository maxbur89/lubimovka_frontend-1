import React, { useState } from 'react';
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

// const fetchAllPressReleases = (years: Years) => {
//   let data;

//   [2021, 2020, 2015, 2014, 1993].map (async (year: number, idx) => {

//   try {
//     // data = await fetcher<PressRelease>(`/info/press-releases/?year=${year}`);

//   } catch (error) {
//     return;
//   }

//   return data;
//   })
// };

// export const getServerSideProps: GetServerSideProps<Number> = async (year: number) => {

//   const years = await fetchYears();
//   const pressReleaseSelected = await fetchPressRelelaseSelected(year);
//   const pressReleaseInitial = await fetchPressRelelaseInitial();

//   return {
//     props: {
//       years,
//       pressReleaseInitial,
//       pressReleaseSelected,
//     },
//   };
// };

export const getServerSideProps: GetServerSideProps = async () => {

  const years = await fetchYears();
  const pressRelease = await fetchPressRelelaseInitial();

  // if (years) {
  //   let allPressReleases = await fetchAllPressReleases(years.years);
  // } else {
  //   console.log('Ошибка запроса всех пресс-релизов')
  // }

  //console.log(allPressReleases);

  return {
    props: {
      years,
      pressRelease,
    },
  };
};

// fetchYears()
//   .then((years) => fetchAllPressReleases(years.years))
//     .then(() => {
//       return {
//         props: {  }
//       }
//     }).catch (()=> {
//     console.log('Ошибка')
//     return {
//       props: { }
//     }
//   })
// }

const ForPress = ({ years, pressRelease }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const pressReleaseInitial = pressRelease[0];

  const {
    image: cover,
    title,
    text: contents,
  } = pressReleaseInitial;

  const pressReleaseToRender = Object.assign (
    {
      cover,
      title,
      contents
    }
  );

  const pressReleaseYears = years.years.sort((a: number, b: number) => b - a);
  const pressReleaseDefaultYear = pressReleaseYears[0];
  // const [pressReleaseYearSelected, setPressReleaseYearSelected] = useState<string[] | number>(pressReleaseDefaultYear);
  const [pressReleaseYearSelected, setPressReleaseYearSelected] = useState<number>(pressReleaseDefaultYear);

  // console.log(pressReleaseYearSelected);

  //  const getServerSideProps: GetServerSideProps = async () => {

  //     const pressRelease = await fetchPressRelelaseSelected(pressReleaseYearSelected);

  //     return {
  //       props: {
  //         pressRelease,
  //       },
  //     };
  //   };

  // const PressReleaseSelected = ({ pressRelease }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  // const router = useRouter();

  // useEffect(() => {

  //   setPressReleaseYearSelected(pressReleaseYearSelected);
  //   router.push(`/for-press/?year=${pressReleaseYearSelected}`);
  // }, [ pressReleaseYearSelected ]);

  // const {
  //   image: cover,
  //   title,
  //   text: contents,
  //   ...rest
  // } = pressRelease;

  // const pressReleaseToRender = Object.assign (
  //   {
  //     cover,
  //     title,
  //     contents
  //   }
  // );

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
        pressRelease={pressReleaseToRender}
        pressReleaseDefaultYear={pressReleaseDefaultYear}
        pressReleaseYearSelected={pressReleaseYearSelected}
        setPressReleaseYearSelected={setPressReleaseYearSelected}
        years={years.years}
      />
    </AppLayout>
  );
};

export default ForPress;
