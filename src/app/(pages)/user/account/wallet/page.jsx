"use client";

import React, { useMemo } from "react";
import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { FaRegEye, FaWallet, FaHistory } from "react-icons/fa";
import ShinyCard from "@/app/components/ui/animated/ShinyCard";
import { FaDongSign } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { FcMinus } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { useGetTransaction } from "@/app/queries/wallet/wallet.query";
import { encryptWalletId } from "@/app/helpers";
import { formatCurrency } from "@/app/helpers";

const UserWallet = () => {
  const router = useRouter();
  const { data: walletData, isLoading: isLoadingWallet } = useGetWallet();
  const { data: transactionData, isLoading: isLoadingTransaction } = useGetTransaction();

  // Get the 3 latest transactions
  const latestTransactions = useMemo(() => {
    if (!transactionData || !Array.isArray(transactionData)) return [];
    
    // Sort transactions by date (newest first)
    return [...transactionData]
      .sort((a, b) => {
        const dateA = new Date(a.transactionDate || a.date || 0);
        const dateB = new Date(b.transactionDate || b.date || 0);
        return dateB - dateA;
      })
      .slice(0, 3); // Take only the first 3
  }, [transactionData]);

  if (isLoadingWallet || isLoadingTransaction) {
    return (
      <UserWrapper>
        <div className="flex-grow ml-6 relative">
          <div>Loading...</div>
        </div>
      </UserWrapper>
    );
  }

  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative">
        <div className="flex flex-col relative w-full space-y-6">
          <div className="pb-9 border-b-[1px]">
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-3">
                <FaWallet size={20} className="text-primary" />
                <FootTypo
                  footlabel="My Wallet"
                  className="!m-0 text-lg font-semibold"
                />
              </div>

              <Button
                label="Transaction History"
                icon={<FaHistory size={20} />}
                onClick={() => router.push("/user/account/transactions")}
              />
            </div>
          </div>
          
          {/* Balance Card */}
          <ShinyCard
            className="max-w-full md:max-w-[600px] relative overflow-hidden"
            spotlightColor="rgba(120, 119, 198, 0.3)"
          >        
            <div className="flex flex-col h-full justify-center space-y-4">
              <FootTypo footlabel="Current Balance" className="!m-0 text-white text-opacity-80" />
              
              <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency(walletData?.balance || 0)}  
                </span>
              </div>
              
              <div className="flex flex-col space-y-2 mb-8">
                <div className="flex justify-between text-white text-opacity-90">
                  <span>Wallet ID</span>
                  <span>#{encryptWalletId(walletData?.walletId)}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  label="Top up"
                  icon={<MdPayments size={20} />}
                  onClick={() => router.push("/user/account/topup")}
                  className="bg-primary"
                />
              </div>
            </div>
          </ShinyCard>
          
          {/* Recent Transactions - Only showing 3 latest */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <FootTypo
                footlabel="Recent Transactions"
                className="!m-0 text-lg font-semibold"
              />
            </div>
            
            <div className="shadow-sm  overflow-hidden">
              {(!latestTransactions || latestTransactions.length === 0) ? (
                <div className="p-6 text-center text-gray-500">
                  No transactions found
                </div>
              ) : (
                latestTransactions.map((transaction) => (
                  <div 
                    key={transaction.id || transaction.transactionId} 
                    className="flex justify-between items-center p-4 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {transaction.amount > 0 ? (
                          <FcPlus size={20} />
                        ) : (
                          <FcMinus size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.transactionType || 'Transaction'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.transactionDate || transaction.date || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount || 0)}
                    </div>
                  </div>
                ))
              )}
              
              {latestTransactions && latestTransactions.length > 0 && (
                <div className="p-3 text-center border-t dark:border-gray-700">
                  <Button
                    label="View All Transactions"
                    icon={<FaRegEye size={20} />}
                    onClick={() => router.push("/user/account/transactions")}
                    className=""
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserWallet;
