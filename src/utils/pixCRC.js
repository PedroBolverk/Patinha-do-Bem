export default function crc16(str) {
  let crc = 0xFFFF;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}
