import numpy as np


def simulate_measurements(probability_zero=0.5, shots=100):
    probability_one = 1 - probability_zero

    results = np.random.choice(
        [0, 1],
        size=shots,
        p=[probability_zero, probability_one]
    )

    zeros = int(np.sum(results == 0))
    ones = int(np.sum(results == 1))

    return {
        "shots": shots,
        "zero_count": zeros,
        "one_count": ones,
        "zero_probability": zeros / shots,
        "one_probability": ones / shots
    }