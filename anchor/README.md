# Solana Voting dApp

A decentralized voting application built on Solana blockchain using Anchor framework.

## Development Setup

### Prerequisites

- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)
- [Node.js](https://nodejs.org/) (v16 or higher)

### Build Instructions

1. Navigate to the source code directory:

```bash
cd anchor
```

2. Build the program:

```bash
anchor build
```

3. Copy the compiled program to test fixtures:

```bash
cp target/deploy/voting.so tests/fixtures/
```

### Testing

Run the tests without local validator (for CI/CD):

```bash
anchor test --skip-local-validator --skip-deploy
```

## Project Structure

- `/anchor` - Main program directory
- `/anchor/programs` - Solana program source code
- `/anchor/tests` - Program test files
- `/anchor/target` - Build outputs

## License

[MIT License](LICENSE)
