"""
Quantum communication channel utilities.

This module contains the two channel effects required by the
QDS simulation:

1. Random qubit-flip noise.
2. Intercept-resend attack.

Only NumPy is used.
"""

import numpy as np

try:
    from .states import KET_0, KET_1, KET_PLUS, KET_MINUS, X, H
except ImportError:
    from states import KET_0, KET_1, KET_PLUS, KET_MINUS, X, H


def apply_depolarizing_noise(state, noise_rate):
    state = np.asarray(state, dtype=complex)

    if state.shape != (2,):
        raise ValueError(
            "State must be a 2-element qubit state vector."
        )

    norm = np.linalg.norm(state)

    if not np.isclose(norm, 1.0):
        raise ValueError(
            "State must be normalized."
        )

    if not 0.0 <= noise_rate <= 1.0:
        raise ValueError(
            "noise_rate must be between 0 and 1."
        )

    if np.random.random() < noise_rate:
        noisy_state = X @ state
    else:
        noisy_state = state.copy()

    noisy_norm = np.linalg.norm(noisy_state)

    if noisy_norm <= 0.0:
        raise RuntimeError(
            "Noise operation produced an invalid state."
        )

    return noisy_state / noisy_norm


def _measure_in_z_basis(qubit):
    probability_zero = abs(qubit[0]) ** 2
    probability_one = abs(qubit[1]) ** 2

    outcome = int(
        np.random.choice(
            [0, 1],
            p=[probability_zero, probability_one]
        )
    )

    return outcome


def _measure_in_x_basis(qubit):
    x_basis_state = H @ qubit

    probability_plus = abs(x_basis_state[0]) ** 2
    probability_minus = abs(x_basis_state[1]) ** 2

    outcome = int(
        np.random.choice(
            [0, 1],
            p=[probability_plus, probability_minus]
        )
    )

    return outcome


def simulate_intercept_resend_attack(qubit):
    qubit = np.asarray(qubit, dtype=complex)

    if qubit.shape != (2,):
        raise ValueError(
            "Qubit must be a 2-element state vector."
        )

    norm = np.linalg.norm(qubit)

    if not np.isclose(norm, 1.0):
        raise ValueError(
            "Qubit must be normalized."
        )

    basis = np.random.choice(["Z", "X"])

    if basis == "Z":
        measurement_result = _measure_in_z_basis(qubit)

        if measurement_result == 0:
            resent_qubit = KET_0.copy()
        else:
            resent_qubit = KET_1.copy()

    else:
        measurement_result = _measure_in_x_basis(qubit)

        if measurement_result == 0:
            resent_qubit = KET_PLUS.copy()
        else:
            resent_qubit = KET_MINUS.copy()

    return resent_qubit


if __name__ == "__main__":
    test_qubit = KET_PLUS

    noisy_qubit = apply_depolarizing_noise(
        test_qubit,
        noise_rate=0.5
    )

    resent_qubit = simulate_intercept_resend_attack(
        test_qubit
    )

    print("Original qubit:", test_qubit)
    print("Noisy qubit:", noisy_qubit)
    print("Intercept-resend output:", resent_qubit)
