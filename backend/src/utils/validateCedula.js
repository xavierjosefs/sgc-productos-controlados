export function isValidDominicanCedula(cedula) {
  if (!cedula) return false;

  const raw = cedula.trim();

  if (!/^[0-9-]+$/.test(raw)) {
    return false;
  }

  const clean = raw.replace(/-/g, "");

  if (!/^\d{11}$/.test(clean)) {
    return false;
  }

  const digits = clean.split("").map(Number);

  const factors = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    let product = digits[i] * factors[i];

    if (product >= 10) {
      product = Math.floor(product / 10) + (product % 10);
    }

    sum += product;
  }

  const mod = sum % 10;
  const checkDigit = mod === 0 ? 0 : 10 - mod;

  return checkDigit === digits[10];
}
