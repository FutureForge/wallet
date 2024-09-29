import React from "react";
import { Dialog } from "@/modules/app/dialog";
import { Button } from "@/modules/app/button";
import Image from "next/image";

type NFTModalProps = {
  nft: any;
};

export function NFTDialog({ nft }: NFTModalProps) {
  const imageUrl =
    nft.nft.metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ||
    "/logo.svg";
  return (
    <>
      <div className="w-full items-center justify-between flex mb-4 font-inter">
        <div className="flex flex-col">
          <Dialog.Title>
            <h2 className="text-2xl font-bold">{nft.nft.metadata.name}</h2>
          </Dialog.Title>
          <Dialog.Description>
            <p className="text-muted-foreground text-sm">
              {nft.nft.metadata.description}
            </p>
          </Dialog.Description>
        </div>

        <Dialog.Close>
          <Button variant="secondary" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </Dialog.Close>
      </div>

      <Dialog.Body>
        <div className="flex w-full gap-8">
          <div className="w-1/2 h-fit overflow-hidden group relative rounded-2xl cursor-pointer !max-h-[300px]">
            <Image
              src={imageUrl}
              alt={nft.nft.metadata.name || "NFT"}
              width={1000}
              height={1000}
              className="rounded-2xl group-hover:scale-105 transition-all duration-300 ease-in-out brightness-75"
            />
          </div>
          <div className="w-1/2">
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
              Attributes:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {nft.nft.metadata.attributes?.map((attribute: any) => (
                <div
                  key={attribute.trait_type}
                  className="bg-new-terciary border border-new-elements-border p-2 rounded-lg"
                >
                  <p className="text-muted-foreground capitalize">
                    {attribute.trait_type}
                  </p>
                  <p className="text-foreground font-medium capitalize">
                    {attribute.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Body>
    </>
  );
}
