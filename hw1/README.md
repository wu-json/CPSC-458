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

## Transcript of Run

The following code block is a transcript of the output after running `python3 hw1.py 100000 0.23`. This runs 100,000 simulations for both the Monte Carlo generation and the simulated games, with a hit threshold of 0.23 (I'll explain why I used this threshold later):

```
Blackjack Simulation
----------------------------------
Trials: 100000
Hit Odds Threshold: 0.23
----------------------------------
Generating monte carlo table...
Monte carlo table generated:
[[0.         0.         0.         0.         0.         0.
  0.         0.         0.         0.        ]
 [0.         0.         0.         0.         0.         0.
  0.         0.         0.         0.        ]
 [0.         0.         0.         0.         0.         0.
  0.         0.         0.         0.        ]
 [0.2        0.28571429 0.27272727 0.3125     0.36363636 0.35714286
  0.36       0.25       0.125      0.2125    ]
 [0.125      0.17391304 0.27272727 0.24390244 0.27868852 0.4375
  0.2        0.2244898  0.27659574 0.19021739]
 [0.09230769 0.28070175 0.25454545 0.22033898 0.3        0.37288136
  0.25       0.27027027 0.23076923 0.18959108]
 [0.13253012 0.32608696 0.25641026 0.35632184 0.34090909 0.34567901
  0.38888889 0.26262626 0.19148936 0.19058824]
 [0.1092437  0.23404255 0.24       0.40384615 0.35652174 0.31730769
  0.2972973  0.28440367 0.25179856 0.19120879]
 [0.17142857 0.30827068 0.32       0.34920635 0.33333333 0.33333333
  0.32941176 0.32374101 0.27702703 0.2284345 ]
 [0.19254658 0.27624309 0.33333333 0.3964497  0.3625     0.32903226
  0.39285714 0.34567901 0.28666667 0.25      ]
 [0.1761658  0.37688442 0.33163265 0.43414634 0.37810945 0.39069767
  0.33333333 0.36585366 0.25414365 0.27777778]
 [0.10462287 0.24528302 0.21130221 0.26950355 0.23777778 0.24597701
  0.21265823 0.18227848 0.16511628 0.16283084]
 [0.11659193 0.17985612 0.1588785  0.1987315  0.21052632 0.18957346
  0.22429907 0.18487395 0.17687075 0.16731953]
 [0.10731707 0.19354839 0.17752809 0.21553885 0.19817768 0.22410148
  0.19463087 0.19646799 0.16885965 0.12899543]
 [0.08430913 0.15333333 0.17471264 0.1723301  0.17266187 0.21192053
  0.19910515 0.17960089 0.18501171 0.13423576]
 [0.11286682 0.14470842 0.16331096 0.16129032 0.17961165 0.18159204
  0.17183771 0.12990196 0.14705882 0.14194299]
 [0.05555556 0.13235294 0.14159292 0.14452214 0.140625   0.16052632
  0.18367347 0.12028302 0.12555066 0.11522634]
 [0.06280193 0.08905852 0.12293144 0.12787724 0.13457077 0.16778523
  0.17493473 0.18882979 0.10239651 0.08838072]
 [0.04228856 0.08101266 0.08737864 0.13605442 0.12842105 0.12962963
  0.12623762 0.0984456  0.11139241 0.09080258]
 [0.03791469 0.0600316  0.05980066 0.05723906 0.07118644 0.07070707
  0.07654723 0.06129597 0.05498282 0.06663603]
 [0.10914454 0.15274463 0.18778281 0.21822542 0.19730942 0.1751663
  0.16859122 0.15024631 0.17523364 0.14268218]]
----------------------------------
Running simulated games...
----------------------------------
Random Win Rate: 0.28402
Monte Carlo Win Rate: 0.41179
Games won by player: 41179
```

## Analysis

It appears that with a random hit strategy, the win rate is usually around `28%`, which is not very good. Using the Monte Carlo strategy with a threshold of `0.5`, we are able to improve this by a whopping `10%` for an average win-rate close to `38.3%`. While this is already a decent improvement, I tested a variety of thresholds from `0.2 - 0.8`, and found that a threshold of `0.23` regularly outperformed other thresholds, and brought the win-rate up to `41.1%`. Anything higher or lower and that did worse. 

```
----------------------------------
Running simulated games...
----------------------------------
Random Win Rate: 0.28402
Monte Carlo Win Rate (hit threshold of 0.23): 0.41179
Games won by player: 41179
```
