"""
Quantum teleportation utilities.

This module performs the Bell-state measurement (BSM) used in
the teleportation part of the QDS simulation.

The input consists of one qubit represented as a normalized
2-element complex NumPy vector.

The teleportation setup contains three qubits:

    Qubit 1: input/signature qubit
    Qubit 2: Alice's half of the Bell pair
    Qubit 3: Bob's half of the Bell pair

Therefore the joint state has 2^3 = 8 amplitudes.
"""

import numpy as np

try:
    from .states import I, X, Z
except ImportError:
    from states import I, X, Z


SQRT2 = np.sqrt(2.0)

PHI_PLUS = np.array([1, 0, 0, 1], dtype=complex) / SQRT2
PHI_MINUS = np.array([1, 0, 0, -1], dtype=complex) / SQRT2
PSI_PLUS = np.array([0, 1, 1, 0], dtype=complex) / SQRT2
PSI_MINUS = np.array([0, 1, -1, 0], dtype=complex) / SQRT2

BELL_STATES = {
    "00": PHI_PLUS,
    "01": PHI_MINUS,
    "10": PSI_PLUS,
    "11": PSI_MINUS,
}


def _validate_qubit(qubit):
    state = np.asarray(qubit, dtype=complex)

    if state.shape != (2,):
        raise ValueError(
            "Input qubit must be a 2-element state vector."
        )

    norm = np.linalg.norm(state)

    if not np.isclose(norm, 1.0):
        raise ValueError(
            "Input qubit must be normalized."
        )

    return state


def _bob_state_for_bell_outcome(input_qubit, bell_state):
    joint_state = np.kron(input_qubit, PHI_PLUS)

    joint_tensor = joint_state.reshape(2, 2, 2)
    bell_matrix = bell_state.reshape(2, 2)

    bob_state = np.einsum(
        "ij,ijk->k",
        np.conjugate(bell_matrix),
        joint_tensor
    )

    return bob_state


def bell_state_measurement(input_qubit):
    input_qubit = _validate_qubit(input_qubit)

    probabilities = {}
    bob_states = {}

    for bits, bell_state in BELL_STATES.items():
        bob_state = _bob_state_for_bell_outcome(
            input_qubit,
            bell_state
        )

        probability = float(
            np.vdot(bob_state, bob_state).real
        )

        probabilities[bits] = probability
        bob_states[bits] = bob_state

    probability_values = np.array(
        [probabilities[bits] for bits in BELL_STATES],
        dtype=float
    )

    probability_values = np.clip(
        probability_values,
        0.0,
        None
    )

    probability_sum = probability_values.sum()

    if probability_sum <= 0.0:
        raise RuntimeError(
            "Bell measurement produced an invalid probability distribution."
        )

    probability_values /= probability_sum

    outcomes = list(BELL_STATES.keys())

    outcome_bits = str(
        np.random.choice(
            outcomes,
            p=probability_values
        )
    )

    bob_state = bob_states[outcome_bits]

    bob_norm = np.linalg.norm(bob_state)

    if bob_norm <= 0.0:
        raise RuntimeError(
            "Selected Bell measurement outcome has zero-probability state."
        )

    bob_state = bob_state / bob_norm

    post_measurement_state = np.kron(
        BELL_STATES[outcome_bits],
        bob_state
    )

    post_measurement_state /= np.linalg.norm(
        post_measurement_state
    )

    return outcome_bits, post_measurement_state


def apply_teleportation_correction(bob_state, outcome_bits):
    bob_state = _validate_qubit(bob_state)

    corrections = {
        "00": I,
        "01": Z,
        "10": X,
        "11": X @ Z,
    }

    if outcome_bits not in corrections:
        raise ValueError(
            "Bell measurement outcome must be 00, 01, 10, or 11."
        )

    corrected_state = corrections[outcome_bits] @ bob_state

    norm = np.linalg.norm(corrected_state)

    if norm <= 0.0:
        raise RuntimeError(
            "Teleportation correction produced an invalid state."
        )

    return corrected_state / norm


if __name__ == "__main__":
    try:
        from .states import KET_PLUS
    except ImportError:
        from states import KET_PLUS

    outcome, collapsed_state = bell_state_measurement(
        KET_PLUS
    )

    print("Bell measurement outcome:", outcome)
    print("Post-measurement state:", collapsed_state)
