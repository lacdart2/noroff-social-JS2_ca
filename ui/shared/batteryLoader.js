/**
 * @fileoverview Battery-style loader UI component
 * Dynamically renders a loading animation styled as a horizontal battery
 * Used to show activity while posts or data are being fetched.
 */

export function renderBatteryLoader(targetSelector = "#batteryLoader") {
  const container = document.querySelector(targetSelector);

  if (!container) return;

  container.innerHTML = `
    <div class="flex justify-center items-center my-10">
      <div class="flex gap-1 border border-gray-300 p-1 rounded-md w-fit">
        <div class="battery-cell w-4 h-6 bg-gray-300 rounded-sm animate-battery-delay-1"></div>
        <div class="battery-cell w-4 h-6 bg-gray-300 rounded-sm animate-battery-delay-2"></div>
        <div class="battery-cell w-4 h-6 bg-gray-300 rounded-sm animate-battery-delay-3"></div>
        <div class="battery-cell w-4 h-6 bg-gray-300 rounded-sm animate-battery-delay-4"></div>
        <div class="battery-cell w-4 h-6 bg-gray-300 rounded-sm animate-battery-delay-5"></div>
      </div>
    </div>
  `;
}

export function showLoader() {
  const loader = document.querySelector("#batteryLoader");
  if (loader) loader.classList.remove("hidden");
}

export function hideLoader() {
  const loader = document.querySelector("#batteryLoader");
  if (loader) loader.classList.add("hidden");
}

