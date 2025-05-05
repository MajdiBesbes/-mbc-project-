import React from 'react';
import { InlineWidget } from 'react-calendly';

const CalendlyWidget: React.FC = () => {
  return (
    <div className="h-[700px] w-full">
      <InlineWidget
        url="https://calendly.com/majdi-besbes"
        styles={{ height: '100%', width: '100%' }}
        prefill={{
          email: '',
          firstName: '',
          lastName: '',
          name: '',
        }}
        pageSettings={{
          backgroundColor: 'ffffff',
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: '0055A4',
          textColor: '333333'
        }}
        utm={{
          utmCampaign: 'website',
          utmContent: 'rdv-expert',
          utmMedium: 'website',
          utmSource: 'mbc-consulting'
        }}
      />
    </div>
  );
};

export default CalendlyWidget;