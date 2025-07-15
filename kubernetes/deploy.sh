#!/usr/bin/env bash
# Apply Urlvy Kubernetes manifests with our registry & namespace

set -euo pipefail

# === Configuration ===
: "${REGISTRY:?Please set REGISTRY (e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com)}"
NAMESPACE="${NAMESPACE:-urlvy}"
K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# === Ensure namespace exists ===
if ! kubectl get namespace "${NAMESPACE}" &>/dev/null; then
  echo "Creating namespace ${NAMESPACE}..."
  kubectl create namespace "${NAMESPACE}"
fi

# === Apply manifests ===
echo "Deploying Urlvy to namespace ${NAMESPACE} using registry ${REGISTRY}..."

# Export for envsubst
export REGISTRY
export NAMESPACE

for manifest in "${K8S_DIR}"/*.yaml; do
  echo "Applying $(basename "${manifest}")..."
  # Replace <YOUR_REGISTRY> placeholders and set namespace
  envsubst < "${manifest}" | kubectl apply -f -
done

echo "✅ All resources applied."
