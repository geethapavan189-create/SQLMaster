import { useEffect, useRef } from 'react';

export default function AdBanner({ format = 'auto', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        // Ad blocked or not loaded
      }
    }
  }, []);

  return (
    <div className={`ad-container my-6 overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3895650459235192"
        data-ad-slot="auto"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
