import { useOnboardingState } from '@/hooks/useOnboardingState';
import { LoginPage } from './LoginPage';
import { ShopifyIngestionPage } from './ShopifyIngestionPage';
import { SalesAssistantPage } from './SalesAssistantPage';
import { OrdersManagementPage } from './OrdersManagementPage';

export const OnboardingFlow = () => {
  const {
    state,
    getCurrentStep,
    setLoginData,
    setUploadBatchId,
    setBusinessId,
    setTelegramBotToken,
  } = useOnboardingState();

  const currentStep = getCurrentStep();

  const handleLoginSuccess = (data: {
    userId: string;
    password: string;
    businessId?: string;
    authMetadata?: Record<string, unknown>;
  }) => {
    setLoginData(data);

    if (data.businessId) {
      setBusinessId(data.businessId);
    }

    // TEMPORARY: For UI testing, always set telegram_bot_token on login
    setTelegramBotToken('mock-telegram-bot-token');
  };

  const handleIngestionSuccess = (uploadBatchId: string) => {
    setUploadBatchId(uploadBatchId);
  };

  switch (currentStep) {
    case 'login':
      return <LoginPage onSuccess={handleLoginSuccess} />;

    case 'ingestion':
      return (
        <ShopifyIngestionPage
          businessId={state.businessId || ''}
          onSuccess={handleIngestionSuccess}
        />
      );

    case 'orders':
      return <OrdersManagementPage businessId={state.businessId || ''} />;

    case 'testing':
      return <SalesAssistantPage businessId={state.businessId || ''} />;

    default:
      return <LoginPage onSuccess={handleLoginSuccess} />;
  }
};
