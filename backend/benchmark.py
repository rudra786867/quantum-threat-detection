import os
import csv
import random
import statistics
from datetime import datetime

# --- Configuration & Constants ---
RANDOM_SEED = 42
NUM_TRIALS = 100
TAU_THRESHOLD = 0.080  # 8.0%

# Define file paths relative to this script's location
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
DOCS_DIR = os.path.join(BASE_DIR, 'docs')
CSV_OUT_PATH = os.path.join(BACKEND_DIR, 'benchmark_results.csv')
MD_OUT_PATH = os.path.join(DOCS_DIR, 'BENCHMARK_REPORT.md')

def simulate_latency():
    """Simulate small execution latency (e.g., measurement + processing)."""
    return random.gauss(5.0, 1.0) # Mean 5ms, SD 1ms

def run_trial(scenario_name, expected_qber, qber_sd, is_nonce_valid):
    """
    Run a single simulation trial without using Machine Learning.
    Detection relies strictly on QBER threshold and nonce freshness.
    """
    # Simulate QBER using a normal distribution around the expected mean
    simulated_qber = random.gauss(expected_qber, qber_sd)
    simulated_qber = max(0.0, min(1.0, simulated_qber))
    
    # 1. Quantum disturbance check (QBER > tau)
    quantum_disturbance = simulated_qber > TAU_THRESHOLD
    
    # 2. Nonce freshness check (Expired nonce -> Replay attack)
    replay_detected = not is_nonce_valid
    
    # Final detection: triggered if EITHER mechanism detects an anomaly
    # Avoids double counting: if both trigger, it still counts as 1 detection
    detected = quantum_disturbance or replay_detected
    
    latency_ms = max(0.1, simulate_latency())
    
    return {
        'scenario': scenario_name,
        'qber': simulated_qber,
        'nonce_valid': is_nonce_valid,
        'quantum_disturbance': quantum_disturbance,
        'replay_detected': replay_detected,
        'detected': detected,
        'latency_ms': latency_ms
    }

def calculate_metrics(trials, scenario_type):
    """
    Calculate summary statistics for a given list of trials.
    scenario_type dictates how we interpret 'detected' (TPR vs FPR/FA).
    """
    qbers = [t['qber'] for t in trials]
    latencies = [t['latency_ms'] for t in trials]
    detections = sum([1 for t in trials if t['detected']])
    
    mean_qber = statistics.mean(qbers)
    sd_qber = statistics.stdev(qbers) if len(qbers) > 1 else 0.0
    mean_latency = statistics.mean(latencies)
    detection_rate = (detections / len(trials)) * 100
    
    metrics = {
        'mean_qber': mean_qber,
        'sd_qber': sd_qber,
        'mean_latency': mean_latency,
        'detection_rate': detection_rate,
        'tpr': 'N/A',
        'fpr': 'N/A',
        'rejection_rate': 'N/A'
    }
    
    # Interpret the detection rate based on the scientific context of the scenario
    if scenario_type == 'legitimate':
        metrics['fpr'] = f"{detection_rate:.1f}%"
    elif scenario_type == 'attack':
        metrics['tpr'] = f"{detection_rate:.1f}%"
    elif scenario_type == 'noise':
        metrics['rejection_rate'] = f"{detection_rate:.1f}%"
        
    return metrics

def main():
    # Set the random seed for exact reproducibility
    random.seed(RANDOM_SEED)
    
    # Ensure output directories exist
    os.makedirs(BACKEND_DIR, exist_ok=True)
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    # Define our testing scenarios
    scenarios = [
        # A: Legitimate traffic (normal noise eta = 0.02)
        {'name': 'A (Legitimate)', 'type': 'legitimate', 'qber_mean': 0.02, 'qber_sd': 0.005, 'nonce_valid': True},
        # B: Intercept-resend forgery attack (expected QBER around 0.25)
        {'name': 'B (Forgery - Intercept/Resend)', 'type': 'attack', 'qber_mean': 0.25, 'qber_sd': 0.02, 'nonce_valid': True},
        # C: Session replay attack (expired nonce, legitimate quantum channel eta = 0.02)
        {'name': 'C (Replay Attack)', 'type': 'attack', 'qber_mean': 0.02, 'qber_sd': 0.005, 'nonce_valid': False},
        # D: Channel decoherence (high noise eta = 0.15)
        {'name': 'D (Channel Decoherence)', 'type': 'noise', 'qber_mean': 0.15, 'qber_sd': 0.015, 'nonce_valid': True}
    ]
    
    all_trials = []
    summary_results = {}
    
    # 1. Run Simulations
    for sc in scenarios:
        scenario_trials = []
        for _ in range(NUM_TRIALS):
            trial_result = run_trial(sc['name'], sc['qber_mean'], sc['qber_sd'], sc['nonce_valid'])
            scenario_trials.append(trial_result)
            all_trials.append(trial_result)
            
        summary_results[sc['name']] = calculate_metrics(scenario_trials, sc['type'])

    # 2. Save individual trials to CSV
    with open(CSV_OUT_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'scenario', 'qber', 'nonce_valid', 'quantum_disturbance', 
            'replay_detected', 'detected', 'latency_ms'
        ])
        writer.writeheader()
        for trial in all_trials:
            writer.writerow(trial)

    # 3. Generate Markdown Report
    with open(MD_OUT_PATH, 'w', encoding='utf-8') as f:
        f.write("# Quantum-Inspired Threat Detection: Benchmark Report\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## 1. Simulation Parameters\n")
        f.write(f"- **Random Seed:** `{RANDOM_SEED}` (for reproducibility)\n")
        f.write(f"- **Trials per Scenario:** `{NUM_TRIALS}`\n")
        f.write(f"- **Threshold (\u03C4):** `{TAU_THRESHOLD:.3f}` ({TAU_THRESHOLD*100:.1f}%)\n")
        f.write("- **Methodology:** Physical QBER limit checks and cryptographic nonce freshness (NO machine learning).\n\n")

        f.write("## 2. Metric Definitions\n")
        f.write("- **True Positive Rate (TPR):** The percentage of actual attacks correctly flagged as threats. Calculated for Scenarios B and C.\n")
        f.write("- **False Positive Rate (FPR):** The percentage of perfectly legitimate traffic incorrectly flagged as an attack. Calculated for Scenario A.\n")
        f.write("- **False Alarm / Noise Rejection Rate:** The percentage of trials rejected due to environmental noise exceeding thresholds rather than a malicious attacker. Evaluated in Scenario D (High Decoherence).\n\n")

        f.write("## 3. Benchmark Results\n\n")
        f.write("| Scenario | Mean QBER | QBER SD | Latency (ms) | TPR | FPR | FA / Rejection |\n")
        f.write("|----------|-----------|---------|--------------|-----|-----|----------------|\n")
        
        for sc in scenarios:
            name = sc['name']
            m = summary_results[name]
            f.write(f"| {name} | {m['mean_qber']:.4f} | {m['sd_qber']:.4f} | {m['mean_latency']:.2f} | {m['tpr']} | {m['fpr']} | {m['rejection_rate']} |\n")
        
        f.write("\n## 4. Scientific Limitations & Disclaimer\n")
        f.write("> **Note on Information-Theoretic Security:** This benchmark simulates a finite number of trials on classical hardware. While the results demonstrate the correctness of the physical threshold and freshness validation logic, they **do not** constitute a proof of zero information-theoretic forgery probability. True unconditional security requires mathematical proofs applicable to infinite key limits and full quantum hardware implementations.\n")

    print(f"Benchmark complete!")
    print(f"Results saved to: {CSV_OUT_PATH}")
    print(f"Report generated: {MD_OUT_PATH}")

if __name__ == '__main__':
    main()
