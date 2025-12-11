"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// CONFIGURATION
const CONTRACT_ADDRESS = "0x20c17DEf0B29ebb1519C1E889c3Da80C788Bc111";
const COLLECTION_SIZE = 10;
const BASE_URI = "https://jade-accepted-unicorn-954.mypinata.cloud/ipfs/bafybeibqyz7oxlu7qpxwb6eoytqwacg5ic5atarzl52sbnywpb6jstn5gq/";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, programFilter, nfts]);

  const fetchNFTs = async () => {
    let tempNfts = [];
    for (let i = 1; i <= COLLECTION_SIZE; i++) {
      try {
        const response = await fetch(`${BASE_URI}${i}.json`);
        const metadata = await response.json();
        const imgLink = metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
        tempNfts.push({
          id: i,
          name: metadata.attributes.find(a => a.trait_type === "Student Name").value,
          program: metadata.attributes.find(a => a.trait_type === "Program").value,
          grade: metadata.attributes.find(a => a.trait_type === "Grade").value,
          image: imgLink
        });
      } catch (err) {
        console.error("Error fetching NFT", i, err);
      }
    }
    setNfts(tempNfts);
    setFilteredNfts(tempNfts);
  };

  const filterData = () => {
    let result = nfts;
    if (searchTerm) {
      result = result.filter(nft => nft.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (programFilter !== "All") {
      result = result.filter(nft => nft.program === programFilter);
    }
    setFilteredNfts(result);
  };

  return (
    <div className="min-h-screen p-12 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-white drop-shadow-lg tracking-wide">
        🎓 Graduate Certificate Gallery
      </h1>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-5 mb-10 justify-center">
        <input
          type="text"
          placeholder="Search by Student Name..."
          className="p-4 rounded-xl border border-gray-700 w-full md:w-1/3 bg-gray-800 text-white shadow-xl focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-4 rounded-xl border border-gray-700 bg-gray-800 text-white shadow-xl focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="All">All Programs</option>
          <option value="Blockchain 101">Blockchain 101</option>
          <option value="Advanced Solidity">Advanced Solidity</option>
          <option value="DeFi Mastery">DeFi Mastery</option>
          <option value="NFT Architecture">NFT Architecture</option>
        </select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredNfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 hover:shadow-blue-500/40 transition duration-300"
          >
            <img src={nft.image} alt={nft.name} className="w-full h-56 object-cover" />
            <div className="p-5 text-white">
              <h2 className="text-2xl font-bold mb-1">{nft.name}</h2>
              <p className="text-blue-300 text-sm">Program: {nft.program}</p>

              <div className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                Grade: {nft.grade}
              </div>

              <a
                href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${nft.id}`}
                target="_blank"
                className="block mt-4 text-center text-blue-400 hover:underline"
              >
                View on OpenSea
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}