import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { experimental_useEffectEvent } from 'react';

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

describe('Voting', () => {

  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{
      name: "voting",
      programId: votingAddress,
    }], []);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    await votingProgram.methods
      .initializePoll(
        new BN(1),
        "What is your favorite color?",
        new BN(0),
        new BN(1847223297),
      ).rpc();

    const [pollAccount] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAccount);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite color?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    expect(poll.candidateAmount.toNumber()).toEqual(0);


  })
})
