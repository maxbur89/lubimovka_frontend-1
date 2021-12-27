import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ForPressPressReleasesView } from './for-press-press-releases-view';
import { pressReleaseString } from './assets/pressReleaseString';

export default {
  title: 'Components/ForPressPressReleasesView',
  component: ForPressPressReleasesView,

} as ComponentMeta<typeof ForPressPressReleasesView>;

const Template: ComponentStory<typeof ForPressPressReleasesView> = (args) => {
  return <ForPressPressReleasesView {...args}/>;
};

export const Default = Template.bind({});

Default.parameters = {
  layout: 'fullscreen'
};

Default.args = pressReleaseString;
