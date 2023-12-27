# @geolonia/opendata-editor

https://geolonia.github.io/opendata-editor/ で公開されている opendata-editor と同様のものを React コンポーネントとして利用できます。

### インストール

```shell
npm install @geolonia/opendata-editor
```

### 使い方

```tsx
import { OpenDataEditor } from '@geolonia/opendata-editor';
import '@geolonia/opendata-editor/style.css';

export const Page = (): JSX.Element => {
  return (
    <>
      <OpenDataEditor />
    </>
  );
};
```
