#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(_ctx: Context<InitializePoll>, _poll_id: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account()]
    pub poll: Account<'info, Poll>,
}

#[account]
pub struct Poll {
    pub poll_id: u64,
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}
