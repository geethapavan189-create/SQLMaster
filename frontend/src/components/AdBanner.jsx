import { useEffect, useRef } from 'react';

export default function AdBanner({ slot, format = 'auto', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current && window.adsbygoogle && adRef.current) {
      try {
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch (e) {
        console.log('Ad error:', e);
      }
    }
  }, []);

  return (
    <div className={`ad-container my-6 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3895650459235192"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
