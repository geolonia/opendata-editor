import type { Meta, StoryObj } from '@storybook/react';

import { OpenDataEditor } from '../lib/OpenDataEditor';

const meta = {
  title: 'OpenDataEditor/OpenDataEditor',
  component: OpenDataEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OpenDataEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <>
      <script src="https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY"></script>
      <OpenDataEditor />
    </>
  ),
};
