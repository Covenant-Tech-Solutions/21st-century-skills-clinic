import { useEffect } from 'react';

const AdSense = () => {

  const adClient = process.env.NEXT_PUBLIC_DATA_AD_CLIENT
  const adSlot = process.env.NEXT_PUBLIC_DATA_AD_SLOT

  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    (adsbygoogle = window.adsbygoogle).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;