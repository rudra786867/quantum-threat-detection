"""
Basic quantum states and single-qubit operators.
"""

import numpy as np


# Computational basis states
KET_0 = np.array([1, 0], dtype=complex)
KET_1 = np.array([0, 1], dtype=complex)


# Pauli X-basis eigenstates
KET_PLUS = np.array([1, 1], dtype=complex) / np.sqrt(2)
KET_MINUS = np.array([1, -1], dtype=complex) / np.sqrt(2)


# Pauli matrices
I = np.array([
    [1, 0],
    [0, 1]
], dtype=complex)

X = np.array([
    [0, 1],
    [1, 0]
], dtype=complex)

Y = np.array([
    [0, -1j],
    [1j, 0]
], dtype=complex)

Z = np.array([
    [1, 0],
    [0, -1]
], dtype=complex)


# Hadamard gate
H = np.array([
    [1, 1],
    [1, -1]
], dtype=complex) / np.sqrt(2)
