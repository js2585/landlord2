import React, { Fragment } from 'react';

const Rules = () => {
  return (
    <Fragment>
      <div className='rules'>
        <h1 className='large'>Game Rules</h1>
        <p>
          Beat the landlord is played by three players. The game uses a standard
          54-card deck including the two jokers. Each player is initially dealt
          17 cards, and three cards will remain in the middle. The goal of the
          game is to get rid of all of your cards.
        </p>
        <h2 className='lead my-1'>The Auction</h2>
        <p>
          There is an auction to determine who will be the landlord and play
          alone against the other two players who will be the peasants. The
          possible bids are 1, 2, and 3 representing how many times the bid
          value they are willing to wager. The bid value is set in place before
          the game. The first player to bid will be randomly chosen. Each
          player's turn to bid, the player may either pass or bid higher than
          the highest bid so far. If everyone passes before someone bids, the
          deck is reshuffled and dealed. If there is a bid, the bidding
          continues until two consecutive players pass or someone bids a 3. The
          highest bidder becomes the landlord. This player picks up the three
          cards in the middle.
        </p>
        <h2 className='lead my-1'>The Game</h2>
        <p>
          The landlord plays first, and may play any legal combination. Each
          subsequent player must either pass (play nothing) or beat the previous
          play by playing the same combination but with a higher rank. There are
          only two exceptions to this: rockets can beat any other combination,
          and bombs can beat any other combination except for a higher ranking
          bomb and a rocket. This play continues until two consecutive players
          pass, at which point the next player can now play any legal
          combination since he was the one that played the cards the other two
          players both passed on.
        </p>
        <p className='my-1'>
          Card ranking from low to high (suits are irrelevant): 3, 4, 5, 6, 7,
          8, 9, 10, J, Q, K, A, 2, Black Joker, Red Joker
        </p>
        <p className='my-1'>
          In Beat the Landlord, there are many different combinations that can
          be played. Some examples of combinations include:{' '}
        </p>
        <ul>
          <li>
            <strong>Pairs</strong> - Two cards of same rank, for example 5-5.
          </li>
          <li>
            <strong>Triplet</strong> - Three cards of same rank, for example
            6-6-6.{' '}
          </li>
          <li>
            <strong>Triplet with an attached card</strong> - A triplet with any
            single card added, for example 7-7-7-8. These are ranked according
            to the value of the triplet, thus 8-8-8-3 can beat 7-7-7-8 even
            though 3 is less than 8.
          </li>
          <li>
            <strong>Triplet with an attached pair</strong> - A triplet with a
            pair added, for example 9-9-9-5-5. These rank according to the
            triplet.
          </li>
          <li>
            <strong>Sequence</strong> - Five or more consecutive cards, for
            example 3-4-5-6-7. These rank according to the lowest value card in
            the sequence.
          </li>
          <li>
            <strong>Bomb</strong> - Four cards of the same rank, for example
            2-2-2-2. A bomb can beat everything but a higher ranking bomb and
            rocket.
          </li>
          <li>
            <strong>Rocket</strong> - Both jokers. These beat everything.
          </li>
        </ul>
        <p className='my-1'>
          Those are the common combinations but the full list can be found{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://en.wikipedia.org/wiki/Dou_dizhu#Category_of_hands'
          >
            here
          </a>
        </p>
        <h2 className='lead my-1'>Scoring</h2>
        <p>
          If the landlord runs out of cards first, he has won and each peasant
          will have to pay him the bid value (some cash value) times the current
          bid (1, 2, or 3) provided that no bombs or rockets were played. If one
          of the peasants runs out of cards before the landlord, the landlord
          must pay the the bid value times the current bid to each peasant. For
          example, if a game has a bid value of $2000, the highest bid was a 2,
          and the landlord lost, the landlord will have to pay $4000 to each
          peasant. If the landlord won, each peasant will have to pay the
          landlord $4000. For each instance a bomb or rocket is played, the
          current bid is doubled. For example, if a rocket and two bombs are
          played in a game with a bid of 3, the bid is now 24. If the bid value
          of that game is $2000, the landlord could potentially lose $48,000 or
          gain $48,000.
        </p>
        <h1 className='large my-2'>Site Rules</h1>
        <p>
          There are some general rules you should be aware of when playing on
          this site.
        </p>
        <h2 className='lead my-1'>Game Structure</h2>
        <p>
          In each game, random or hosted, there will be a total of 3 rounds
          played with each player being able to have first bid in one of the
          rounds.
        </p>
        <h2 className='lead my-1'>Leaving Games</h2>
        <p>
          Leaving the game once it has started will result in losing the money
          you have lost in the game already and also a 5% penalty on your
          earnings. If you had already made money, leaving the game will forfeit
          all of that money and still include the 5% penalty. Each player has 60
          seconds to make a move (pass, bid, play cards) or else he will be
          kicked out of the game for being AFK. The penalties still apply.
        </p>
        <h2 className='lead my-1'>Hosting Games</h2>
        <p>
          Hosting a game costs $7,500, and the host will be able to set the bid
          value of the game. Once the host has created the game, players may
          join by entering the same url as the host.
        </p>
        <h2 className='lead my-1'>Running Out of Money</h2>
        <p>
          In the case that you have lost all of your money gambling, you will
          not be able to join any games until you make some more money. In order
          to get more money, you may beg other users to donate to you.
        </p>
      </div>
    </Fragment>
  );
};

export default Rules;
