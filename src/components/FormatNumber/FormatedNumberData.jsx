import React from 'react';
import { FormattedNumber, IntlProvider } from 'react-intl';

const FormattedNumberData = ({value}) => {
  return (
    <IntlProvider locale="en">
      <FormattedNumber
        value={value}
        maximumFractionDigits={1}
        notation="compact"
        compactDisplay="short"
      />
    </IntlProvider>
  );
};

export default FormattedNumberData;