import React from 'react';
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

interface NFTModalProps {
  nft: any;
  onClose: () => void;
}

const NFTModal: React.FC<NFTModalProps> = ({ nft, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{nft.nft.metadata.name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
            <MediaRenderer
              client={client}
              src={nft.nft.metadata.image}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-300 mb-4">{nft.nft.metadata.description}</p>
            <h3 className="text-xl font-semibold mb-2">Attributes:</h3>
            <div className="grid grid-cols-2 gap-2">
              {nft.nft.metadata.attributes?.map((attribute: any) => (
                <div key={attribute.trait_type} className="bg-gray-700 p-2 rounded">
                  <p className="font-medium">{attribute.trait_type}</p>
                  <p className="text-gray-300">{attribute.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTModal;