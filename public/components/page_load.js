$(document).ready(function () {
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const domLoadedTime =
    navigationEntry.responseStart - navigationEntry.requestStart;
  const renderTimeElement = document.getElementById('loading');
  renderTimeElement.innerHTML +=
    'client - ' + (Math.floor(domLoadedTime) + ' ms');
});