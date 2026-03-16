export function onError(error: any) {
  let message = String(error);

  if (!(error instanceof Error) && error.message) {
    message = String(error.message);
  }

  alert(message);
}
