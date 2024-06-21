export function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      report(result.state);
      // geoBtn.style.display = 'none'
    } else if (result.state === "prompt") {
      report(result.state);
      // geoBtn.style.display = 'none'
      // navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings)
    } else if (result.state === "denied") {
      report(result.state);
      // geoBtn.style.display = 'inline'
    }
    result.addEventListener("change", () => {
      report(result.state);
    });
  });
}

function report(state: any) {
  console.log(`Permission ${state}`);
}
