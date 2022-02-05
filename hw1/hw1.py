import simplegui
import random

# load card sprite - 936x384 - source: jfitz.com
CARD_SIZE = (72, 96)
CARD_CENTER = (36, 48)
card_images = simplegui.load_image(
    "http://storage.googleapis.com/codeskulptor-assets/cards_jfitz.png")

CARD_BACK_SIZE = (72, 96)
CARD_BACK_CENTER = (36, 48)
card_back = simplegui.load_image(
    "http://storage.googleapis.com/codeskulptor-assets/card_jfitz_back.png")

# initialize some useful global variables
global in_play
in_play = False
global outcome
outcome = " start game"
score = 0

# define globals for cards
SUITS = ('C', 'S', 'H', 'D')
RANKS = ('A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K')
VALUES = {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
          '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10}


# define card class
class Card:
    def __init__(self, suit, rank):
        if (suit in SUITS) and (rank in RANKS):
            self.suit = suit
            self.rank = rank
        else:
            self.suit = None
            self.rank = None
            print "Invalid card: ", suit, rank

    def __str__(self):
        return self.suit + self.rank

    def get_suit(self):
        return self.suit

    def get_rank(self):
        return self.rank

    def draw(self, canvas, pos):
        card_loc = (CARD_CENTER[0] + CARD_SIZE[0] * RANKS.index(self.rank),
                    CARD_CENTER[1] + CARD_SIZE[1] * SUITS.index(self.suit))
        canvas.draw_image(card_images, card_loc, CARD_SIZE, [
                          pos[0] + CARD_CENTER[0], pos[1] + CARD_CENTER[1]], CARD_SIZE)

# define hand class


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

    def draw(self, canvas, pos):
        # draw a hand on the canvas, use the draw method for cards
        for c in self.cards:
            c.draw(canvas, pos)
            pos[0] += 100  # shift to the right for next card

# define deck class


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


# define event handlers for buttons
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

# draw handler


def draw(canvas):
    global outcome
    # test to make sure that card.draw works, replace with your code below

    #card = Card("S", "A")
    #card.draw(canvas, [10, 10])
    canvas.draw_text('Blackjack', (160, 50), 60, 'Red')
    canvas.draw_text('Player hand:', (10, 160), 52, 'Black')
    playerpos = [10, 200]
    housepos = [10, 400]
    playerhand.draw(canvas, playerpos)
    canvas.draw_text('House hand:', (10, 360), 52, 'Black')
    househand.draw(canvas, housepos)

    if in_play:
        housepos = [10, 400]
        canvas.draw_image(card_back, CARD_BACK_CENTER, CARD_BACK_SIZE,
                          [housepos[0] + CARD_BACK_CENTER[0],
                           housepos[1] + CARD_BACK_CENTER[1]],
                          CARD_BACK_SIZE)
    # print outcome, "XXX"
    if outcome != None:
        canvas.draw_text(outcome, (10, 560), 32, 'Orange')
    if not in_play:
        canvas.draw_text("New deal?", (10, 600), 32, 'Orange')
    canvas.draw_text("Score: " + str(score), (400, 560), 32, 'Orange')


# initialization frame
frame = simplegui.create_frame("Blackjack", 600, 600)
frame.set_canvas_background("Green")

# create buttons and canvas callback
frame.add_button("Deal", deal, 200)
frame.add_button("Hit",  hit, 200)
frame.add_button("Stand", stand, 200)
frame.set_draw_handler(draw)


# get things rolling
deal()
frame.start()
