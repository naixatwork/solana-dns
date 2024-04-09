## Track of the task

### todos

- [x] public domains
- [x] register domains
- [x] init dns
  - [x] use PDA `PublicKey.findProgramAddressSync`
- [ ] implement other methods
  - lack of knowledge when it comes to seeds and ownership of domain account.
- [ ] transfer `sol` from wallet into `workSpace.baseAccount` because base account is the signer.
  - according to [solana-on-svelte](https://github.com/silvestrevivo/solana-svelte-counter/blob/master/app/src/routes/index.svelte) it should happen from the idl side?
- [x] architecture
- [x] reactivity integration between svelte and rxjs
  - still not completely sure if it's a good practice
- [x] tailwind, scss, ui library
- [x] logging
- [x] vitest, testing
- [x] documentation
- [x] responsiveness
- [x] separate `devnet` from mainnet via `.env`
- [ ] if possible fix force npm install issue

### learning material

#### solana:
- https://docs.solanalabs.com/
- https://docs.alchemy.com/docs/integrating-your-solana-program-with-a-web3-application
- https://www.youtube.com/watch?v=0P8JeL3TURU&list=PLilwLeBwGuK6NsYMPP_BlVkeQgff0NwvU
- https://github.com/silvestrevivo/solana-svelte-counter/tree/master
- https://www.youtube.com/watch?v=zoRFutuZimc&list=PL53JxaGwWUqCr3xm4qvqbgpJ4Xbs4lCs7&index=14
- https://www.youtube.com/watch?v=jjEZBmWI1S4&t=825s
- https://github.com/
- https://stackoverflow.com/
- `depricated` https://github.com/muprotocol/mu

#### svelte / frontend:
- https://svelte.dev/
- https://www.skeleton.dev/elements/buttons
- https://chat.openai.com/
- https://rxjs.dev/
- https://lucide.dev/

## Documentation - solanaDns

### Architecture and Philosophy

on average human brain cannot process more than 5 tasks at the same time, that's why there are 5 folders or `layers`
inside `src` directory.

the `layers` are:

- `app`
- `business`
- `core`
- `shared`
- `node-modules (hidden)`

each `layer` has its own rules, and it's corresponding rules when it comes to other `layers` they generally help us
determine which high level or low level code belongs where.

#### Relationship rules

- `import` has to always happen from top (`app`) to bottom (`node-modules`) this rule prevents any **circular
  dependency,** and it gives a clear way to determine if code is meant to be **low-level** or **high-level** .
- each `layer` or `sub_layer` should **provide** not **contain** code for example a `layer` with name `component`
  or `utils` just contains/categorize code it doesn't give any idea or context.

#### Single rules

- `app` represents the starting point of the software and holds `main.ts` almost every configuration can happen at this
  level such as `routing` or `layout`.
    - `app` is high-level.
    - normally frontend applications will be tested all the time by **product** and **QA team**  we can trust high-level
      code will be tested **manually**.
- `business` will provide business logic for example various features that software provides and makes money of.
    - `business` is high-level.
    - `integration testing` and `e2e` testing would be more suited for this layer.
- `core` many entities in the software have **relations**. our `service` logics will be defined here.
    - `core` is low-level but **business oriented**.
    - `integration testing` would be more suited and also `unit testing`
- `shared` should provide units of code so **abstract** and **generic** enough that we can use it for another project.
    - shared is low-level.
    - `unit testing` would be more suited.
    - there should be no `logging` done in `shared`.

### File and Folder Structures:

- follows the `LIFT` style guide from https://angular.io/guide/styleguide#lift
    - Locate
    - Identify
    - Flat
    - T-DRY (Try to be DRY)
    - sibling tests

### Paradigms

- `functional programming`
    - Stratified design
    - Straightforward implementation
    - Abstraction barrier
    - Minimal interface
    - Comfortable layers
    - `reactive programming` using `rxjs` and `svelte`
- `procedural programming`
- `OOP` and design patterns related to OOP will `NOT` be used
    - https://www.youtube.com/watch?v=QM1iUe6IofM

### Clean Code Guidelines

- immutability
    - copy-on-write
- favor `explicit argument` over `implicit argument`
- `pure functions` first approach
- naming conventions from uncle Bob's book
- number of words based on the function or value's context
- upto `3 parameters` only
- using the same level of `abstraction` in a unit of code
- `unit tests` for low level code

### Git

- commit messages follow the conventional commit guideline https://www.conventionalcommits.org/en/v1.0.0/
