#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>, 
        poll_id: u64, 
        poll_description: String,
        poll_start: u64,
        poll_end: u64,        
    ) -> Result<()> {

        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = poll_description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;

        msg!("Poll initialized with ID: {}", poll_id);
        msg!("Poll description: {}", poll.description);
        msg!("Poll start time: {}", poll.poll_start);
        msg!("Poll end time: {}", poll.poll_end);
        msg!("Candidate amount: {}", poll.candidate_amount);
        msg!("Poll account created with address: {}", poll.key());
        msg!("Poll account initialized successfully.");
        
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        candidate_name: String,
        _poll_id: u64,
    )->Result<()>{

        let candidate = &mut ctx.accounts.candidate;
        candidate.candidate_name = candidate_name;
        candidate.candidate_votes = 0;

        let poll = &mut ctx.accounts.poll;
        poll.candidate_amount += 1;

        msg!("Candidate initialized with name: {}", candidate.candidate_name);
        msg!("Candidate votes: {}", candidate.candidate_votes);
        msg!("Poll ID: {}", poll.poll_id);
        msg!("Candidate Amount: {}", poll.candidate_amount);
        msg!("Candidate account created with address: {}", candidate.key());
        msg!("Candidate account initialized successfully.");

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, candidate_name: String, poll_id: u64) ->Result<()> {
        let candidate = &mut  ctx.accounts.candidate;
        candidate.candidate_votes += 1;
        msg!("Vote casted for candidate: {}", candidate.candidate_name);
        msg!("Candidate votes: {}", candidate.candidate_votes);
        msg!("Poll ID: {}", poll_id);
        msg!("Vote casted successfully.");
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction[poll_id: u64]]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + Poll::INIT_SPACE, 
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(candidate_name:String, poll_id:u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        init, 
        payer = signer, 
        space = 8 + Candidate::INIT_SPACE, 
        seeds = [poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    
    pub system_program: Program<'info, System>,

}


#[derive(Accounts)]
#[instruction(candidate_name:String, poll_id:u64)]
pub struct Vote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
}


#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(64)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(64)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}
