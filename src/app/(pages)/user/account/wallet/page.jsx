"use client";

import React from "react";
import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { FaRegEye, FaWallet, FaHistory } from "react-icons/fa";
import ShinyCard from "@/app/components/ui/animated/ShinyCard";
import { FaRegCreditCard } from "react-icons/fa";
import { FaDongSign } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { FcMinus } from "react-icons/fc";

const UserWallet = () => {
  const transactions = [
    { id: 1, date: '2023-06-15', description: 'Service Payment', amount: -52.50, status: 'completed' },
    { id: 2, date: '2023-06-10', description: 'Top Up', amount: 100.00, status: 'completed' },
    { id: 3, date: '2023-05-28', description: 'Service Payment', amount: -35.00, status: 'completed' },
  ];

  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative">
        <div className="flex flex-col relative w-full space-y-6">
          <div className="pb-6 border-b-[1px]">
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
                onClick={() => {}}
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
                <FaDongSign size={20} className="text-white" />
                <span className="text-4xl font-bold text-white">131.230</span>
              </div>
              
              <div className="flex flex-col space-y-2 mb-8">
                <div className="flex justify-between text-white text-opacity-90">
                  <span>Last Top-up</span>
                  <span>June 10, 2023</span>
                </div>
                <div className="flex justify-between text-white text-opacity-90">
                  <span>Card Number</span>
                  <span>**** **** **** 7890</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  label="Top up"
                  icon={<MdPayments size={20} />}
                  onClick={() => console.log("clicked")}
                  className="bg-primary"
                />
              </div>
            </div>
          </ShinyCard>
          
          {/* Recent Transactions */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <FootTypo
                footlabel="Recent Transactions"
                className="!m-0 text-lg font-semibold"
              />
              <Button
                label="View All"
                icon={<FaRegEye size={20} />}
                onClick={() => {}}
              />
            </div>
            
            <div className="shadow-sm">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center p-4 border-b dark:border-gray-700 last:border-0"
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
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserWallet;
