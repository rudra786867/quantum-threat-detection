"""
Main quantum simulation engine for the QDS project.

This module keeps the original measurement utility used by
the Django backend and adds the full QDS simulation entry point.
"""

import numpy as np

try:
    from .states import KET_0, KET_1, KET_PLUS, KET_MINUS
    from .teleport import (
        bell_state_measurement,
        apply_teleportation_correction,
        BELL_STATES,
    )
    from .channel import (
        apply_depolarizing_noise,
        simulate_intercept_resend_attack,
    )
except ImportError:
    from states import KET_0, KET_1, KET_PLUS, KET_MINUS
    from teleport import (
        bell_state_measurement,
        apply_teleportation_correction,
        BELL_STATES,
    )
    from channel import (
        apply_depolarizing_noise,
        simulate_intercept_resend_attack,
    )


# ---------------------------------------------------------------------------
# EXISTING MEASUREMENT UTILITY
# ---------------------------------------------------------------------------

def simulate_measurements(probability_zero=0.5, shots=100):
    """
    Existing measurement simulator.

    This function is preserved because the Django views currently
    use it.
    """

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


# ---------------------------------------------------------------------------
# FIDELITY
# ---------------------------------------------------------------------------

def _state_fidelity(reference_state, measured_state):
    """
    Calculate fidelity between two pure quantum states.

    For pure states:

        F = |<reference|measured>|^2
    """

    overlap = np.vdot(reference_state, measured_state)

    return float(abs(overlap) ** 2)


# ---------------------------------------------------------------------------
# RANDOM SIGNATURE STATE
# ---------------------------------------------------------------------------

def _random_signature_state():
    """
    Select one of the four required Pauli eigenstates.
    """

    states = [
        KET_0,
        KET_1,
        KET_PLUS,
        KET_MINUS,
    ]

    index = np.random.randint(len(states))

    return states[index].copy()


# ---------------------------------------------------------------------------
# QDS SIMULATION
# ---------------------------------------------------------------------------

def run_qds_simulation(
    shots=256,
    noise_rate=0.02,
    attack_type="none"
):
    """
    Run the quantum digital-signature teleportation simulation.

    Parameters
    ----------
    shots : int
        Number of independent simulation rounds.

    noise_rate : float
        Probability of a qubit-flip channel error.

    attack_type : str
        Supported values:

            "none"
                Normal channel.

            "intercept_resend"
                Apply an intercept-resend attack.

    Returns
    -------
    dict
        Simulation measurements and security statistics.
    """

    if not isinstance(shots, (int, np.integer)) or shots <= 0:
        raise ValueError(
            "shots must be a positive integer."
        )

    if not 0.0 <= noise_rate <= 1.0:
        raise ValueError(
            "noise_rate must be between 0 and 1."
        )

    supported_attacks = {
        "none",
        "intercept_resend",
    }

    if attack_type not in supported_attacks:
        raise ValueError(
            "attack_type must be 'none' or 'intercept_resend'."
        )

    bell_counts = {
        "phi_plus": 0,
        "phi_minus": 0,
        "psi_plus": 0,
        "psi_minus": 0,
    }

    error_count = 0
    fidelity_sum = 0.0

    bell_names = {
        "00": "phi_plus",
        "01": "phi_minus",
        "10": "psi_plus",
        "11": "psi_minus",
    }

    for _ in range(shots):

        # Original signature state.
        original_state = _random_signature_state()

        # Copy the original state before applying channel effects.
        transmitted_state = original_state.copy()

        # Apply intercept-resend if requested.
        if attack_type == "intercept_resend":
            transmitted_state = simulate_intercept_resend_attack(
                transmitted_state
            )

        # Apply stochastic channel noise.
        transmitted_state = apply_depolarizing_noise(
            transmitted_state,
            noise_rate
        )

        # Bell-state measurement.
        outcome_bits, post_measurement_state = (
            bell_state_measurement(transmitted_state)
        )

        # Record Bell-state measurement result.
        bell_name = bell_names[outcome_bits]
        bell_counts[bell_name] += 1

        # Extract Bob's conditional state by projecting the
        # collapsed three-qubit state onto the measured Bell state.
        bell_state = BELL_STATES[outcome_bits]

        collapsed_tensor = post_measurement_state.reshape(4, 2)
        bell_matrix = bell_state.reshape(4, 1)

        bob_state = np.sum(
            np.conjugate(bell_matrix) * collapsed_tensor,
            axis=0
        )

        bob_norm = np.linalg.norm(bob_state)

        if bob_norm <= 0.0:
            raise RuntimeError(
                "Invalid Bob state produced by Bell measurement."
            )

        bob_state /= bob_norm

        # Bob uses Alice's two classical bits to select
        # the appropriate Pauli correction.
        corrected_state = apply_teleportation_correction(
            bob_state,
            outcome_bits
        )

        # Compare recovered state against the ORIGINAL signature.
        fidelity = _state_fidelity(
            original_state,
            corrected_state
        )

        fidelity_sum += fidelity

        # Fidelity below this numerical threshold means that
        # the recovered state differs from the original state.
        if fidelity < 0.999999:
            error_count += 1

    observed_qber = error_count / shots
    teleportation_fidelity = fidelity_sum / shots

    return {
        "shots": int(shots),
        "error_count": int(error_count),
        "observed_qber": float(observed_qber),
        "teleportation_fidelity": float(
            teleportation_fidelity
        ),
        "bell_counts": bell_counts,
    }


# ---------------------------------------------------------------------------
# DIRECT COMMAND-LINE EXECUTION
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    result = run_qds_simulation()

    print("QDS simulation result:")
    print(result)
