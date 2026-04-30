// Utilitário para geração de PIX Copia e Cola (EMV standard)
import crypto from 'crypto'

function crc16(data) {
  let crc = 0xFFFF
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
      crc &= 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function formatField(id, value) {
  return id + value.length.toString().padStart(2, '0') + value
}

export function generatePixCopyPaste({ pixKey, merchantName, merchantCity = 'SAO PAULO', amount, description = 'Rifa' }) {
  const payload = []
  
  payload.push(formatField('00', '01'))
  payload.push(formatField('01', '11'))
  
  const merchantAccount = formatField('00', 'br.gov.bcb.pix') + formatField('01', pixKey)
  payload.push(formatField('26', merchantAccount))
  
  payload.push(formatField('52', '0000'))
  payload.push(formatField('53', '986'))
  
  if (amount) {
    payload.push(formatField('54', amount.toFixed(2)))
  }
  
  payload.push(formatField('58', 'BR'))
  payload.push(formatField('59', merchantName.substring(0, 25)))
  payload.push(formatField('60', merchantCity.substring(0, 15)))
  
  const additionalData = formatField('00', description.substring(0, 25))
  payload.push(formatField('62', additionalData))
  
  const payloadStr = payload.join('')
  const payloadWithCrc = payloadStr + '6304'
  const crc = crc16(payloadWithCrc)
  
  return payloadWithCrc + crc
}

export function generatePixQRCodeUrl(pixCopyPaste) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopyPaste)}`
}
