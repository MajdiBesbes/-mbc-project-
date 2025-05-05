import { useCallback } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share';

export const useSocialShare = (url: string, title: string) => {
  const shareOnSocial = useCallback((platform: string) => {
    const shareData = {
      url,
      title,
      hashtags: ['MBCConsulting', 'ExpertComptable', 'Entrepreneuriat']
    };

    switch (platform) {
      case 'facebook':
        return <FacebookShareButton url={url} quote={title} />;
      case 'linkedin':
        return <LinkedinShareButton url={url} title={title} />;
      case 'twitter':
        return <TwitterShareButton url={url} title={title} />;
      case 'whatsapp':
        return <WhatsappShareButton url={url} title={title} />;
      default:
        return null;
    }
  }, [url, title]);

  return { shareOnSocial };
};