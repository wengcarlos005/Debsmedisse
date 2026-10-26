/* ============================================================
   PIX — gera o código "copia e cola" (BR Code estático)
   seguindo o padrão EMV do Banco Central. O mesmo texto vira
   o QR Code que o cliente escaneia no app do banco.
   ============================================================ */

const Pix = (() => {
  /* tira acento e caractere especial: o padrão só aceita ASCII */
  function limpar(txt, max) {
    return String(txt || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9 ]/g, '')
      .trim()
      .slice(0, max);
  }

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, '0') + valor;
  }

  /* CRC16-CCITT (polinômio 0x1021, início 0xFFFF) */
  function crc16(txt) {
    let crc = 0xFFFF;
    for (let i = 0; i < txt.length; i++) {
      crc ^= txt.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  /* deixa a chave no formato que o Pix espera, conforme o tipo */
  function normalizarChave(tipo, chave) {
    const c = String(chave || '').trim();
    const digitos = c.replace(/\D/g, '');
    if (tipo === 'cpf') return digitos;                       // CPF ou CNPJ
    if (tipo === 'telefone') {
      return '+' + (digitos.startsWith('55') && digitos.length >= 12 ? digitos : '55' + digitos);
    }
    if (tipo === 'email') return c.toLowerCase();
    return c;                                                 // aleatória
  }

  /**
   * @param {object} o  { tipo, chave, nome, cidade, valor, txid }
   * @returns {string}  código copia e cola
   */
  function gerar(o) {
    const conta = campo('00', 'br.gov.bcb.pix') + campo('01', normalizarChave(o.tipo, o.chave));
    const txid  = limpar(o.txid, 25).replace(/ /g, '') || '***';

    let p = campo('00', '01')
          + campo('26', conta)
          + campo('52', '0000')
          + campo('53', '986');
    if (o.valor > 0) p += campo('54', Number(o.valor).toFixed(2));
    p += campo('58', 'BR')
       + campo('59', limpar(o.nome, 25) || 'RECEBEDOR')
       + campo('60', limpar(o.cidade, 15) || 'BRASIL')
       + campo('62', campo('05', txid))
       + '6304';
    return p + crc16(p);
  }

  return { gerar, crc16, normalizarChave };
})();

if (typeof module !== 'undefined') module.exports = Pix;
