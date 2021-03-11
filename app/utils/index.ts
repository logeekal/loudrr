export const openAuthPopUp = (
  name: string,
  address: string
): Window | undefined => {
  const hasWindow = typeof window !== "undefined";

  if (hasWindow) {
    return window.open(
      address,
      name,
      "height=500,width=400,left=50%,top=50%,scrollbars=no,toolbar=no,menubar=no, status=yes"
    );
  }
  return undefined;
};
