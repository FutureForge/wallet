/* eslint-disable import/no-cycle */
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { getFormatAddress } from '@/utils/functions/getFormatValue';
import { Button } from '..';
import { useAccount, useDisconnect } from 'wagmi';

export default function Details() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Button onClick={() => disconnect()} type="button" variant="secondary">
      <MdOutlineAccountBalanceWallet />
      <p className=" ml-1  tracking-tighter text-[.8125rem] font-sans leading-none !py-0">
        {!address ? '' : getFormatAddress(address)}
      </p>
    </Button>
  );
}
