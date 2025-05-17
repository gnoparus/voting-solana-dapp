import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { experimental_useEffectEvent } from 'react';

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

describe('Voting', () => {

  let context;
  let provider;
  let votingProgram;

  beforeAll(async () => {
    context = await startAnchor("", [{
      name: "voting",
      programId: votingAddress,
    }], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

  });

  it('Initialize Poll', async () => {

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


  });

  it("Initialize Candidate", async () => {
    await votingProgram.methods.initializeCandidate(
      "Red",
      new BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Blue",
      new BN(1),
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "Green",
      new BN(1),
    ).rpc();

    const [pollCandidateAccountRed] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Red")],
      votingAddress);

    const candidateRed = await votingProgram.account.candidate.fetch(pollCandidateAccountRed);

    console.log(candidateRed);

    expect(candidateRed.candidateName).toEqual("Red");
    expect(candidateRed.candidateVotes.toNumber()).toEqual(0);


    const [pollCandidateAccountBlue] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Blue")],
      votingAddress);

    const candidateBlue = await votingProgram.account.candidate.fetch(pollCandidateAccountBlue);

    console.log(candidateBlue);

    expect(candidateBlue.candidateName).toEqual("Blue");
    expect(candidateBlue.candidateVotes.toNumber()).toEqual(0);


    const [pollCandidateAccountGreen] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Green")],
      votingAddress);

    const candidateGreen = await votingProgram.account.candidate.fetch(pollCandidateAccountGreen);

    console.log(candidateGreen);

    expect(candidateGreen.candidateName).toEqual("Green");
    expect(candidateGreen.candidateVotes.toNumber()).toEqual(0);

    // Check poll account
    const [pollAccount] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAccount);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.candidateAmount.toNumber()).toEqual(3);



  });

  it("Vote", async () => {
    await votingProgram.methods.vote(
      "Red",
      new BN(1),
    ).rpc();

    await votingProgram.methods.vote(
      "Red",
      new BN(1),
    ).rpc();

    await votingProgram.methods.vote(
      "Red",
      new BN(1),
    ).rpc();

    await votingProgram.methods.vote(
      "Blue",
      new BN(1),
    ).rpc();
    await votingProgram.methods.vote(
      "Blue",
      new BN(1),
    ).rpc();

    await votingProgram.methods.vote(
      "Green",
      new BN(1),
    ).rpc();

    const [pollCandidateAccountRed] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Red")],
      votingAddress);
    const candidateRed = await votingProgram.account.candidate.fetch(pollCandidateAccountRed);

    console.log(candidateRed);

    expect(candidateRed.candidateName).toEqual("Red");
    expect(candidateRed.candidateVotes.toNumber()).toEqual(3);

    const [pollCandidateAccountBlue] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Blue")],
      votingAddress);

    const candidateBlue = await votingProgram.account.candidate.fetch(pollCandidateAccountBlue);

    console.log(candidateBlue);

    expect(candidateBlue.candidateName).toEqual("Blue");
    expect(candidateBlue.candidateVotes.toNumber()).toEqual(2);


    const [pollCandidateAccountGreen] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Green")],
      votingAddress);

    const candidateGreen = await votingProgram.account.candidate.fetch(pollCandidateAccountGreen);

    console.log(candidateGreen);

    expect(candidateGreen.candidateName).toEqual("Green");
    expect(candidateGreen.candidateVotes.toNumber()).toEqual(1);

  });
});
