import crc16 from "./pixCRC";
export function generatePixPayload({ pixKey, amount, merchantName = 'RECEBEDOR', city = 'SAO PAULO', txid = 'TXID123' }) {
  const format = (id, value) =>
    id + value.length.toString().padStart(2, '0') + value;

  // 👇 REMOVA a conversão para centavos
 const valor = amount.toFixed(2); // Ex: 1.22 vira "1.22"

  const payloadSemCRC =
    format('00', '01') +
    format('26',
      format('00', 'BR.GOV.BCB.PIX') +
      format('01', pixKey)
    ) +
    format('52', '0000') +
    format('53', '986') +
    format('54', valor) + // ← valor em centavos
    format('58', 'BR') +
    format('59', merchantName.substring(0, 25).toUpperCase()) +
    format('60', city.substring(0, 15).toUpperCase()) +
    format('62', format('05', txid)) +
    '6304';

  const crc = crc16(payloadSemCRC);
  return payloadSemCRC + crc;
}
