// Payment utilities for x402 integration

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PaymentInfo, PaymentResponse } from './types';

/**
 * Create a Solana payment transaction
 */
export async function createPaymentTransaction(
  connection: Connection,
  fromPublicKey: PublicKey,
  paymentInfo: PaymentInfo['payment']
): Promise<Transaction> {
  const transaction = new Transaction();

  const recipientPublicKey = new PublicKey(paymentInfo.recipient);
  const amount = paymentInfo.amount * LAMPORTS_PER_SOL; // Convert to lamports

  // Add transfer instruction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: recipientPublicKey,
      lamports: amount,
    })
  );

  // Add memo if provided
  if (paymentInfo.memo) {
    // Note: You'll need @solana/spl-memo package for memo instructions
    // For now, we'll skip memo support
  }

  return transaction;
}

/**
 * Sign and send payment transaction
 */
export async function makePayment(
  connection: Connection,
  wallet: any, // Wallet adapter wallet (useWallet hook result)
  paymentInfo: PaymentInfo['payment']
): Promise<PaymentResponse> {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected or does not support transactions');
  }

  const transaction = await createPaymentTransaction(
    connection,
    wallet.publicKey,
    paymentInfo
  );

  // Sign and send transaction using wallet adapter
  const signature = await wallet.sendTransaction(transaction, connection);

  // Confirm transaction
  await connection.confirmTransaction(signature, 'confirmed');

  return {
    transaction: signature,
    amount: paymentInfo.amount,
    token: paymentInfo.token,
  };
}

