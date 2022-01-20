import React, { useState, useEffect } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import { Url } from 'shared/types';

import { addBaseUrlToApiPath } from 'shared/helpers/url';
import { AppLayout } from 'components/app-layout/index';
import { ForPressHero } from 'components/for-press-hero';
import { ForPressPressReleasesView } from 'components/for-press-press-releases-view';
import { forPressProps, prPerson } from '../../mocks/data/forPress';
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

// const fetchPressRelelaseInitial = async () => {
//   let data;

//   try {
//     data = await fetcher<PressRelease>('/info/press-releases/');

//   } catch (error) {
//     return;
//   }

//   return data;
// };

const fetchPressRelelaseSelected = async (year: number) => {
  let data;

  try {
    data = await fetcher<PressRelease[]>(`/info/press-releases/?year=${year}`);

  } catch (error) {
    return;
  }

  return data;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const years = await fetchYears();

  const pressReleaseYears = years.years.sort((a: number, b: number) => b - a);
  const pressReleaseDefaultYear = pressReleaseYears[0];
  const pressReleaseFromServer = await fetchPressRelelaseSelected((Number(params.year)));

  let pressRelease;

  if (pressReleaseFromServer === [] || undefined) {
    pressRelease === undefined;
  } else {
    pressRelease = pressReleaseFromServer[0];
  }

  const yearSelected = params.year;
  const pressReleasePDF = addBaseUrlToApiPath(`/info/press-releases/${pressRelease.id}/download/`);

  return {
    props: {
      pressReleaseYears,
      pressReleaseDefaultYear,
      yearSelected,
      pressRelease,
      pressReleasePDF
    },
  };
};

const ForPress = ({ pressReleaseYears, pressReleaseDefaultYear, yearSelected, pressRelease, pressReleasePDF }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const {
    image: cover,
    title,
    text: contents,
  } = pressRelease;

  const pressReleaseToRender = Object.assign (
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
        pressRelease={pressReleaseToRender}
        pressReleaseDefaultYear={yearSelected}
        years={pressReleaseYears}
        PDF={pressReleasePDF}
      />
    </AppLayout>
  );
};

export default ForPress;
