CASTQUEST — TOKEN + FLOW SPEC (PHASE 1, BASE‑ONLY)
Status: Locked
Chain: Base
Scope: Tokens, Rewards, Buybacks, Launch Flow, SubDAO, Fees, Anti‑Spam
DAO Token: GXQS
1. TOKEN LAYERS
1.1 Protocol Tokens (Global)
These are the core assets of the CastQuest economy.

Token	Purpose	Notes
CAST	Main protocol token (like ZORA)	Buybacks from all verticals
QUEST	Activity + quest token	Earned from actions, used in liquidity
GXQS	DAO + meta-governance token	Controls parameters, fees, rewards
All three are ERC20 on Base.

1.2 System Tokens (Vertical‑Specific)
Each creative vertical has its own system token.

Vertical	Token	Purpose
MEDIA	MEDIA	Rewards for media posts, buyback sink
FRAME	FRAME	Rewards for frame creation, buyback sink
GAME	GAME	Rewards for game creation, buyback sink
CODE	CODE	Rewards for code/apps, buyback sink
AGENT	AGENT	Rewards for agent actions, buyback sink
All are ERC20 on Base.

These tokens:

reward creators

receive buybacks from their vertical

feed into SubDAO identity value

1.3 User‑Spawned Tokens
Every user‑generated asset mints its own token:

Examples:

MEDIA → MER (Mercedes)

FRAME → AIR (Airdrop frame)

GAME → SUPERMARIO

CODE → APPX

AGENT → BOTX

Properties:

ERC20 on Base

Fixed supply (default: 8,000,000)

Minted 100% to creator

Pre‑launch state until liquidity exists

Visible in Profile → Wallet → Portfolio

2. SUBDAO SYSTEM
Every user has a SubDAO identity:

Handle: @username

URL: castquest.com/@username

Stored in SubDAORegistry.sol

SubDAO tracks:

system token rewards (MEDIA/FRAME/GAME/CODE/AGENT)

user token launches (MER, AIR, SUPERMARIO…)

total marketcap of all user tokens

activity score

creator reputation

SubDAO interacts with GXQS DAO for:

grants

boosts

governance

reward multipliers

3. LAUNCH FLOW (MEDIA EXAMPLE)
3.1 User Action
User uploads media (e.g., Mercedes photo).

User fills:

Title: MERCEDES

Ticker: MER

Description: any text

3.2 Protocol Action (MediaLaunchRouter.sol)
Deploy user token

Deploy ERC20 MER with fixed supply 8,000,000.

Mint to creator

Creator receives all 8M MER.

Register token

Add to SubDAO profile.

Reward system token

Creator receives MEDIA reward (configurable).

Set pre‑launch state

MER cannot be sold until liquidity exists.

Emit events

For indexers, UI, analytics.

Same flow for FRAME, GAME, CODE, AGENT.

4. FEE + BUYBACK FLOW
Every action in the system triggers a fee.

4.1 Fee Sources
MEDIA mint/sale

FRAME publish/use

GAME score/reward

CODE deploy/use

AGENT action

QUEST actions

CAST interactions

4.2 FeeRouter.sol
All fees go to FeeRouter.

FeeRouter splits fees into:

Destination	Purpose
System token buyback	MEDIA/FRAME/GAME/CODE/AGENT
QUEST buyback	Global activity sink
CAST buyback	Protocol value
Treasury	Grants, infra, SubDAO boosts
Percentages are:

stored on‑chain

adjustable only via GXQS DAO + timelock

4.3 Buyback Logic
FeeRouter:

swaps ETH → system tokens

swaps ETH → QUEST

swaps ETH → CAST

sends remainder to treasury

Buybacks:

increase token value

reward creators indirectly

strengthen SubDAO identity

strengthen GXQS governance

5. REWARD SYSTEM
5.1 System Token Rewards
Each vertical has its own reward rate:

Action	Reward Token	Default
MEDIA post	MEDIA	8M user token + MEDIA reward
FRAME publish	FRAME	8M user token + FRAME reward
GAME creation	GAME	8M user token + GAME reward
CODE deploy	CODE	8M user token + CODE reward
AGENT action	AGENT	8M user token + AGENT reward
All reward rates are:

stored on‑chain

adjustable via GXQS DAO

6. ANTI‑SPAM + SAFETY
6.1 On‑Chain Protections
Min price per launch

Min content size

Max launches per user per time window

Optional EOA‑only mode

Pre‑launch lock until liquidity exists

6.2 Admin Controls
Controlled by GXQS DAO:

reward multipliers

fee percentages

anti‑spam thresholds

treasury routing

buyback ratios

No “god mode” — all changes go through timelock.

7. PROFIT MODEL (FOR YOU + COMMUNITY)
7.1 Creator Profit
Creators earn:

100% of their user token supply

system token rewards

buyback‑driven appreciation

SubDAO reputation

7.2 Protocol Profit
Protocol earns:

CAST buybacks

QUEST buybacks

treasury ETH

system token buybacks

GXQS staking pool inflows

7.3 GXQS Holder Profit
GXQS stakers earn:

a basket of system tokens (MEDIA/FRAME/GAME/CODE/AGENT)

indirect CAST/QUEST appreciation

governance power

8. PHASE 1 SUMMARY (BASE‑ONLY)
Everything lives on Base:

CAST

QUEST

GXQS

MEDIA

FRAME

GAME

CODE

AGENT

All user tokens (MER, AIR, SUPERMARIO…)

SubDAORegistry

Media/Frame/Game/Code/Agent engines

FeeRouter + BuybackEngine
