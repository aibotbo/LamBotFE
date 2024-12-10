import { ComponentType, Suspense } from 'react';
import { IPageConfig } from 'types';
import CustomLoader from 'components/CustomLoader';

export const Loader = (Component: ComponentType) => (props: IPageConfig) =>
  (
    <Suspense fallback={<CustomLoader />}>
      <Component {...props} />
    </Suspense>
  );
