import random
import numpy as np
import sys

global in_play
global outcome
in_play = False
outcome = " start game"
score = 0

SUITS = ('C', 'S', 'H', 'D')
RANKS = ('A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K')
VALUES = {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
          '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10}


class Card:
    def __init__(self, suit, rank):
        if (suit in SUITS) and (rank in RANKS):
            self.suit = suit
            self.rank = rank
        else:
            self.suit = None
            self.rank = None
            print("Invalid card: ", suit, rank)

    def __str__(self):
        return self.suit + self.rank

    def get_suit(self):
        return self.suit

    def get_rank(self):
        return self.rank


class Hand:
    def __init__(self):
        self.cards = []

    def __str__(self):
        ans = "Hand contains "
        for i in range(len(self.cards)):
            ans += str(self.cards[i]) + " "
        return ans
        # return a string representation of a hand

    def add_card(self, card):
        self.cards.append(card)
        # add a card object to a hand

    def get_value(self):
        value = 0
        aces = False
        for c in self.cards:
            rank = c.get_rank()
            v = VALUES[rank]
            if rank == 'A':
                aces = True
            value += v
        if aces and value < 12:
            value += 10
        return value
        # count aces as 1, if the hand has an ace, then add 10 to hand value if it doesn't bust
        # compute the value of the hand, see Blackjack video


class Deck:
    def __init__(self):
        self.deck = []
        for s in SUITS:
            for r in RANKS:
                self.deck.append(Card(s, r))
        # create a Deck object

    def shuffle(self):
        random.shuffle(self.deck)
        # shuffle the deck

    def deal_card(self):
        return self.deck.pop()
        # deal a card object from the deck

    def __str__(self):
        ans = "The deck: "
        for c in self.deck:
            ans += str(c) + " "
        return ans
        # return a string representing the deck


def deal():
    global outcome, in_play, theDeck, playerhand, househand, score
    if in_play:
        outcome = "House winds by default!"
        score -= 1
    else:
        outcome = "Hit or stand?"
    in_play = True
    theDeck = Deck()
    theDeck.shuffle()
    # print theDeck
    playerhand = Hand()
    househand = Hand()
    playerhand.add_card(theDeck.deal_card())
    playerhand.add_card(theDeck.deal_card())
    househand.add_card(theDeck.deal_card())
    househand.add_card(theDeck.deal_card())
    # print "Player", playerhand, "Value:", playerhand.get_value()
    # print "House",  househand, "Value:", househand.get_value()
    # print theDeck


def hit():
    global in_play, score, outcome
    if in_play:
        playerhand.add_card(theDeck.deal_card())
        val = playerhand.get_value()
        # print "Player", playerhand, "Value:", val
        if val > 21:
            outcome = "You are busted! House wins!"
            in_play = False
            score -= 1
            # print outcome, "Score:", score
    # if the hand is in play, hit the player

    # if busted, assign a message to outcome, update in_play and score


def stand():
    global score, in_play, outcome
    if playerhand.get_value() > 21:
        outcome = "You are busted."
        return None
    if not in_play:
        outcome = "Game is over."
        return None
    val = househand.get_value()
    while(val < 17):
        househand.add_card(theDeck.deal_card())
        val = househand.get_value()
        # print "House:", househand, "Value:", val
    if (val > 21):
        # print "House is busted!"
        if playerhand.get_value() > 21:
            outcome = "House is busted, but House wins tie game!"
            score -= 1
        else:
            outcome = "House is busted! Player wins!"
            score += 1
    else:
        if (val == playerhand.get_value()):
            outcome = "House wins ties!"
            score -= 1
        elif (val > playerhand.get_value()):
            outcome = "House wins!"
            score -= 1
        else:
            outcome = "Player wins!"
            score += 1
    in_play = False
    # print outcome, "Score:", score
    # if hand is in play, repeatedly hit dealer until his hand has value 17 or more
    # assign a message to outcome, update in_play and score


"""Randomly returns whether to hit or not."""
def hitmerandom():
    return random.choice([True, False])


"""Returns whether to hit or not based on monte carlo table and threshold."""
def hitme(playerhand, dealerfacecard, threshold: float):
    win_rate = monte_carlo_table[playerhand.get_value() - 1, VALUES[dealerfacecard.get_rank()] - 1]
    return win_rate >= threshold


"""Returns a monte-carlo simulation table for n trials."""
def sim(trials):
    global monte_carlo_table

    monte_carlo_table = np.zeros((21, 10))
    wins = np.zeros((21, 10))
    occurrences = np.zeros((21, 10))

    for _ in range(trials):
        deal()

        hit_hands = []
        while in_play and hitmerandom():
            hit_hands.append([playerhand.get_value(), VALUES[househand.cards[0].get_rank()]])
            hit()
        if in_play:
            stand()

            if playerhand.get_value() > househand.get_value() or househand.get_value() > 21:
                for hand in hit_hands:
                    wins[hand[0] - 1, hand[1] - 1] += 1

        for hand in hit_hands:
            occurrences[hand[0] - 1, hand[1] - 1] += 1

    for i in range(21):
        for j in range(10):
            if occurrences[i][j] > 0:
                monte_carlo_table[i][j] = wins[i][j] / occurrences[i][j]

    return monte_carlo_table


"""Returns true if player won, false if dealer won."""
def sim_game_with_random_strategy() -> bool:
    deal()
    while in_play and hitmerandom():
        hit()
    if in_play:
        stand()
        return playerhand.get_value() > househand.get_value() or househand.get_value() > 21

    return False


"""Returns true if player won, false if dealer won."""
def sim_game_with_monte_carlo_strategy(threshold: float) -> bool:
    deal()
    while in_play and hitme(playerhand, househand.cards[0], threshold):
        hit()
    if in_play:
        stand()
        return playerhand.get_value() > househand.get_value() or househand.get_value() > 21

    return False


"""Returns win rate of player after n trials using random strategy."""
def random_strategy_win_rate(trials: int) -> float:
    wins = 0
    for _ in range(trials):
        if (sim_game_with_random_strategy()):
            wins += 1

    return wins/trials


"""Returns win rate of player after n trials using monte carlo strategy."""
def monte_carlo_strategy_win_rate(trials: int, threshold: float) -> float:
    wins = 0
    for _ in range(trials):
        if (sim_game_with_monte_carlo_strategy(threshold)):
            wins += 1

    return wins/trials


if __name__ == '__main__':
    trials = 100000
    threshold = 0.5

    args_count = len(sys.argv)

    if (args_count > 1):
        trials = int(sys.argv[1])
    
    if (args_count > 2):
        threshold = float(sys.argv[2])

    print('Blackjack Simulation')
    print('----------------------------------')

    print('Trials:', trials)
    print('Hit Odds Threshold:', threshold)
    print('----------------------------------')

    print('Generating monte carlo table...')
    sim(trials)
    print('Monte carlo table generated:')
    print(monte_carlo_table)
    print('----------------------------------')

    print('Running simulated games...')
    random_win_rate = random_strategy_win_rate(trials)
    monte_carlo_win_rate = monte_carlo_strategy_win_rate(trials, threshold)

    print('----------------------------------')
    print('Random Win Rate:', random_win_rate)
    print('Monte Carlo Win Rate:', monte_carlo_win_rate)
