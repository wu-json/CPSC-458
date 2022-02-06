# Assignment 1: Blackjack

**CPSC 458: Automated Decision Systems**

Jason Wu (jcw99)

## Rundown of the Code

The core code for Blackjack was taken from the [assignment web page](https://zoo.cs.yale.edu/classes/cs458/hws/hw1.html). I then stripped away any of the code related to the GUI. This includes any `draw` functions + calls to functions from the `simplegui` library. Here is a rundown of the functions I wrote. These are also documented in the code itself via documentation strings.

```
hitmerandom()
-------------
Function that returns a boolean indicating whether to hit or not randomly. Used for control testing and to generate the Monte Carlo table.

hitme(playerhand, dealerfacecard):
-------------
Function that returns a boolean indicating whether to hit or not based on a threshold value and via lookup to the Monte Carlo table. This function was designed/implemented using the spec on the assignment page.

sim(trials)
-------------
Function that runs trials and generates the Monte Carlo table of winning odds based on hands/hits. This function was designed/implemented using the spec on the assignment page.

sim_game_with_random_strategy()
-------------
Function that runs a game with a random hit strategy and returns `True` if the player won and `False` if they lost.

sim_game_with_monte_carlo_strategy(threshold)
-------------
Function that runs a game using the Monte Carlo table lookup and a threshold. Returns `True` if the player won and `False` if they lost.

play_randomly(trials)
-------------
Function that returns the win-rate of the player when using the random hit strategy.

play(trials)
-------------
Function that returns the win-rate of the player when using the Monte Carlo lookup/threshold strategy. This function was designed/implemented using the spec on the assignment page.

hw1.py trials threshold
-------------
The script itself allows you to specify the number of trials to run as well as the Monte Carlo hit threshold value. This made testing different thresholds pretty easy.
```
