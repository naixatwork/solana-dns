PHANTOM_DEVNET_PUBKEY := 7kaBQEzuBpR6mkB4bkuoREztmYRWJ7sH1yGpGFjuiyGA

install:
	npm i --force

docker-pull-solana-image:
	docker pull solanalabs/solana:stable

connect-to-devnet:
	solana config set --url http://api.devnet.solana.com

check-phantom-balance:
	solana balance $(PHANTOM_DEVNET_PUBKEY)
	solana balance $(PHANTOM_DEVNET_PUBKEY) --lamports

airdrop-phantom:
	solana airdrop 5 $(PHANTOM_DEVNET_PUBKEY)
