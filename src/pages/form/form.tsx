import { useReducer } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { AppLayout } from 'components/app-layout';
import PlayProposalLayout from 'components/play-proposal-layout';
import PlayProposalTitle from 'components/play-proposal-title';
import { ParticipationForm } from 'components/participation-form';
import {
  validYearRegexp,
  validEmailRegexp,
  validPhoneNumberRegexp,
} from 'shared/constants/regexps';
import { Nullable } from 'shared/types';
import { fetcher } from 'shared/fetcher';

interface IParticipation {
  first_name: string;
  last_name: string;
  birth_year: string;
  city: string;
  phone_number: string;
  email: string;
  title: string;
  year: string;
  file: Nullable<File>;
}

enum ActionTypes {
  FieldChange,
  Reset,
}

type Action<T = unknown> =
  { type: ActionTypes.FieldChange, payload: { name: string, value: T } }
  | { type: ActionTypes.Reset }

const initialFormState = {
  firstName: { value: '', wasChanged: false },
  lastName: { value: '', wasChanged: false },
  birthYear: { value: '', wasChanged: false },
  city: { value: '', wasChanged: false },
  phoneNumber: { value: '', wasChanged: false },
  email: { value: '', wasChanged: false },
  playTitle: { value: '', wasChanged: false },
  playYear: { value: '', wasChanged: false },
  playFile: { value: null as Nullable<File>, wasChanged: false },
};

const formReducer = (state: typeof initialFormState, action: Action) => {
  switch (action.type) {
  case ActionTypes.FieldChange:
    return {
      ...state,
      [action.payload.name]: {
        value: action.payload.value,
        wasChanged: true,
      },
    };
  case ActionTypes.Reset:
    return initialFormState;
  default:
    return state;
  }
};

const Participation: NextPage = () => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const {
    firstName,
    lastName,
    birthYear,
    city,
    phoneNumber,
    email,
    playTitle,
    playYear,
    playFile,
  } = formState;

  const router = useRouter();
  const currentYear = new Date().getFullYear().toString();

  const getFirstNameError = () => {
    if (!firstName.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (firstName.value.length < 2) {
      return 'Имя должно состоять более чем из 2 символов';
    }

    if (firstName.value.length > 50) {
      return 'Имя должно состоять менее чем из 50 символов';
    }

    return;
  };

  const getLastNameError = () => {
    if (!lastName.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (lastName.value.length < 2) {
      return 'Фамилия должна содержать минимум 2 символа';
    }

    if (lastName.value.length > 50) {
      return 'Фамилия должна состоять менее чем из 50 символов';
    }

    return;
  };

  const getBirthYearError = () => {
    if (!birthYear.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (!validYearRegexp.test(birthYear.value)) {
      return 'Убедитесь, что это значение больше либо равно 1900';
    }

    if (birthYear.value > currentYear) {
      return `Убедитесь, что это значение больше либо равно ${currentYear}`;
    }

    return;
  };

  const getCityError = () => {
    if (!city.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (city.value.length < 2) {
      return 'Город должен содержать минимум 2 символа';
    }

    if (city.value.length > 50) {
      return 'Город должен состоять менее чем из 50 символов';
    }

    return;
  };

  const getPhoneNumberError = () => {
    if (!phoneNumber.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (!validPhoneNumberRegexp.test(phoneNumber.value)) {
      return 'Некорректный номер телефона';
    }

    return;
  };

  const getEmailError = () => {
    if (!email.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (!validEmailRegexp.test(email.value)) {
      return 'Введите правильный адрес электронной почты';
    }

    return;
  };

  const getPlayTitleError = () => {
    if (!playTitle.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (playTitle.value.length > 200) {
      return 'Название пьесы должно состоять менее чем из 200 символов';
    }

    return;
  };

  const getPlayYearError = () => {
    if (!playYear.value.length) {
      return 'Это поле не может быть пустым';
    }

    if (!validYearRegexp.test(playYear.value)) {
      return 'Убедитесь, что это значение больше либо равно 1900';
    }

    if (playYear.value > currentYear) {
      return `Убедитесь, что это значение больше либо равно ${currentYear}`;
    }

    return;
  };

  const getPlayFileError = () => {
    if (!playFile.value) {
      return 'Файл обязателен';
    }

    if (playFile.value && /[а-яА-ЯЁё]/.test(playFile.value.name)) {
      return 'Файл содержит кириллицу, пожалуйста, переименуйте его.';
    }

    if (playFile.value && /[^A-Za-z._-]/.test(playFile.value.name)) {
      return 'Пожалуйста, используйте только латинские символы и знаки - и _';
    }

    return;
  };

  const handleFieldChange = <T,>(name: keyof typeof initialFormState) => (value: T) => {
    dispatch({
      type: ActionTypes.FieldChange,
      payload: {
        name,
        value,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendPlay({
      year: playYear.value,
      first_name: firstName.value,
      last_name: lastName.value,
      birth_year: birthYear.value,
      city: city.value,
      phone_number: phoneNumber.value,
      email: email.value,
      title: playTitle.value,
      file: playFile.value,
    });
  };

  const canSubmit = (
    !getFirstNameError()
    && !getLastNameError()
    && !getBirthYearError()
    && !getCityError()
    && !getPhoneNumberError()
    && !getEmailError()
    && !getPlayTitleError()
    && !getPlayYearError()
    && !getPlayFileError()
  );

  const sendPlay = async (question: IParticipation) => {
    try {
      await fetcher<IParticipation>('/library/participation/', {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
          'Content-type': 'application/json'
        },
      });
    } catch (error) {
      // TODO: обработать  ошибки
      return;
    }

    router.push('/form/success');
  };

  return (
    <AppLayout>
      <PlayProposalLayout>
        <PlayProposalLayout.Image>
          <Image
            src="/images/form/play-script.jpg"
            alt="Напечатанная читка в руках человека"
            layout="fill"
            objectFit="cover"
          />
        </PlayProposalLayout.Image>
        <PlayProposalLayout.Column>
          <PlayProposalTitle/>
          <PlayProposalLayout.Form>
            <ParticipationForm
              firstName={firstName.value}
              onFirstNameChange={handleFieldChange<string>('firstName')}
              firstNameError={firstName.wasChanged ? getFirstNameError() : undefined}
              lastName={lastName.value}
              onLastNameChange={handleFieldChange<string>('lastName')}
              lastNameError={lastName.wasChanged ? getLastNameError() : undefined}
              birthYear={birthYear.value}
              onBirthYearChange={handleFieldChange<string>('birthYear')}
              birthYearError={birthYear.wasChanged ? getBirthYearError() : undefined}
              city={city.value}
              cityError={city.wasChanged ? getCityError() : undefined}
              onCityChange={handleFieldChange<string>('city')}
              phoneNumber={phoneNumber.value}
              onPhoneNumberChange={handleFieldChange<string>('phoneNumber')}
              phoneNumberError={phoneNumber.wasChanged ? getPhoneNumberError() : undefined}
              email={email.value}
              onEmailChange={handleFieldChange<string>('email')}
              emailError={email.wasChanged ? getEmailError() : undefined}
              playTitle={playTitle.value}
              playTitleError={playTitle.wasChanged ? getPlayTitleError() : undefined}
              onPlayTitleChange={handleFieldChange<string>('playTitle')}
              playYear={playYear.value}
              playYearError={playYear.wasChanged ? getPlayYearError() : undefined}
              onPlayYearChange={handleFieldChange<string>('playYear')}
              playFileName={playFile.value ? playFile.value.name : undefined}
              playFileError={playFile.wasChanged ? getPlayFileError() : undefined}
              onPlayFileChange={handleFieldChange<Nullable<File>>('playFile')}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
            />
          </PlayProposalLayout.Form>
        </PlayProposalLayout.Column>
      </PlayProposalLayout>
    </AppLayout>
  );
};

export default Participation;
