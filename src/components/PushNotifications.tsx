import React, { useEffect } from 'react';
import OneSignal from 'react-onesignal';

const PushNotifications: React.FC = () => {
  useEffect(() => {
    OneSignal.init({
      appId: "YOUR_ONESIGNAL_APP_ID",
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
        size: 'medium',
        position: 'bottom-right',
        showCredit: false,
        text: {
          'tip.state.unsubscribed': 'Abonnez-vous aux notifications',
          'tip.state.subscribed': "Merci de votre abonnement",
          'tip.state.blocked': "Vous avez bloqué les notifications",
          'message.prenotify': "Cliquez pour vous abonner aux notifications",
          'message.action.subscribed': "Merci de votre abonnement !",
          'message.action.resubscribed': "Vous êtes réabonné aux notifications",
          'message.action.unsubscribed': "Vous ne recevrez plus de notifications",
          'dialog.main.title': 'Gérer les notifications',
          'dialog.main.button.subscribe': "ACTIVER",
          'dialog.main.button.unsubscribe': "DÉSACTIVER",
          'dialog.blocked.title': "Débloquer les notifications",
          'dialog.blocked.message': "Suivez ces instructions pour autoriser les notifications:"
        }
      }
    });
  }, []);

  return null;
};

export default PushNotifications;