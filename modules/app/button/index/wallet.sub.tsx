import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/utils/functions';
import Details from './details.sub';

type WalletProps = {
  className?: string;
};

export default function Wallet({ className }: WalletProps) {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    setTimeout(() => {
      const connectButton = document.querySelector('[data-testid="rk-connect-button"]');
      if (connectButton) {
        connectButton.addEventListener('click', () => {
          setTimeout(() => {
            const div = document.querySelector('[aria-labelledby="rk_connect_title"]');
            div?.classList.add('z-[9999999]');
            div?.classList.add('pointer-events-auto');
          }, 500);
        });
      }
    }, 1000);
  }, []);

  return address ? (
    <Details />
  ) : (
    <button
      onClick={() => {
        if (openConnectModal) {
          setTimeout(() => {
            const div = document.querySelector('[aria-labelledby="rk_connect_title"]');
            div?.classList.add('z-[9999999]');
            div?.classList.add('pointer-events-auto');
          }, 500);
          openConnectModal();
        }
      }}
      className={cn(
        'z-[9999999] pointer-events-auto !px-2 py-3.5 cursor-pointer w-full !flex-1 ',
        className,
      )}
    >
      Connect
    </button>
  );
}
