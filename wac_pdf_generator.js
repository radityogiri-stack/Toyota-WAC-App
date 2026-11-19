/**
 * Toyota Beyond WAC PDF Generator
 * Reverse-engineered directly from TAM Beyond portal (ServiceBookingWACDetailPage-C4Zy5QeK.js)
 */

(function(window) {
  'use strict';

  const Mi = { text: [0, 0, 0] };
  const pn = { heading: 10, small: 8 };
  const _n = { left: 20, right: 20, top: 20, bottom: 15 };
  const Cc = { left: 83, spacing: 3 };
  const I1 = 88;
  const An = Cc.left / I1;
  const Oa = {
    checklist: [10 * An, 40 * An, 19 * An, 19 * An],
    checklistBP: [10 * An, 34 * An, 14 * An, 14 * An, 16 * An],
    tire: [10 * An, 40 * An, 19 * An, 19 * An],
    other: [10 * An, 40 * An, 19 * An, 19 * An]
  };

  const V1 = e => typeof e === 'string' && e.startsWith('data:');
  const U1 = e => typeof e === 'string' && /^[A-Za-z0-9+/]*={0,2}$/.test(e) && e.length > 0;
  const z1 = e => {
    const t = e.substring(0, 4);
    let n = 'image/png';
    if (t === '/9j/') n = 'image/jpeg';
    else if (t === 'R0lG') n = 'image/gif';
    else if (t.startsWith('iVB')) n = 'image/png';
    return data:;base64,;
  };

  const Ys = async e => {
    if (!e) throw new Error('Image path is required');
    if (V1(e)) return e;
    if (U1(e)) return z1(e);
    try {
      const t = await fetch(e, { method: 'GET', credentials: 'omit' });
      if (!t.ok) throw new Error(Failed to fetch image: HTTP );
      const n = await t.blob();
      return new Promise((r, o) => {
        const i = new FileReader();
        i.onload = () => r(i.result);
        i.onerror = () => o(new Error('Failed to read image as Data URL'));
        i.readAsDataURL(n);
      });
    } catch (t) {
      console.warn('Error converting image to data URL:', t);
      throw t;
    }
  };

  const G1 = async (e, t, n, r) => {
    const o = await Ys(e);
    return new Promise((i, s) => {
      const c = new Image();
      c.onload = () => {
        const h = Math.max(1, Math.round(t * 5));
        const m = Math.max(1, Math.round(n * 5));
        const b = document.createElement('canvas');
        b.width = h;
        b.height = m;
        const y = b.getContext('2d');
        if (!y) {
          s(new Error('Unable to create canvas context'));
          return;
        }
        y.imageSmoothingEnabled = true;
        y.imageSmoothingQuality = 'high';
        const g = Math.max(h / c.width, m / c.height);
        const v = h / g;
        const w = m / g;
        const N = Math.max(0, (c.width - v) / 2);
        const S = Math.max(0, (c.height - w) / 2);
        const D = Math.min(r * 5, h / 2, m / 2);
        y.beginPath();
        y.moveTo(D, 0);
        y.lineTo(h - D, 0);
        y.quadraticCurveTo(h, 0, h, D);
        y.lineTo(h, m - D);
        y.quadraticCurveTo(h, m, h - D, m);
        y.lineTo(D, m);
        y.quadraticCurveTo(0, m, 0, m - D);
        y.lineTo(0, D);
        y.quadraticCurveTo(0, 0, D, 0);
        y.closePath();
        y.clip();
        y.drawImage(c, N, S, v, w, 0, 0, h, m);
        i(b.toDataURL('image/png'));
      };
      c.onerror = () => s(new Error('Failed to load image into Canvas'));
      c.src = o;
    });
  };

  const T1 = (e, t) => {
    const n = _n.top;
    e.setFont('helvetica', 'bold');
    e.setFontSize(pn.heading);
    e.text('HASIL WALK AROUND CHECK KENDARAAN', t.pageWidth / 2, n, { align: 'center' });
    return n + 10;
  };

  const Fa = (e, t, n, r, o) => {
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.setFillColor(0, 0, 0);
    e.setTextColor(255, 255, 255);
    e.setFont('helvetica', 'bold');
    e.setFontSize(pn.small);
    e.rect(t, n, o, 6, 'FD');
    e.text(r, t + 2, n + 4);
    return n + 6;
  };

  const Fc = (e, t, n, r, o, i) => {
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.setTextColor(0, 0, 0);
    e.setFont('helvetica', 'italic');
    e.setFontSize(pn.small);
    let s = t;
    const c = r.some(l => l.includes('\n')) ? 7 : 5;
    r.forEach((l, h) => {
      e.rect(s, n, o[h], c);
      const m = i?.includes(h) ? 'center' : undefined;
      const b = m === 'center' ? s + o[h] / 2 : s + 1;
      const y = c === 7 ? n + 3 : n + 4;
      e.text(l, b, y, { align: m });
      s += o[h];
    });
    return n + c;
  };

  const Hs = (e, t, n, r, o, i) => {
    e.setTextColor(...Mi.text);
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    let s = t;
    r.forEach((c, l) => {
      e.rect(s, n, o[l], 5);
      const h = i?.includes(l) ? 'center' : undefined;
      const m = h === 'center' ? s + o[l] / 2 : s + 1;
      if (String(c) === '&#10003' || String(c) === '✓') {
        e.setFont('ZapfDingbats', 'normal');
        e.setFontSize(pn.small);
        e.text('4', m, n + 4, { align: h });
        e.setFont('helvetica', 'normal');
      } else {
        e.setFont('helvetica', 'normal');
        e.setFontSize(pn.small);
        e.text(String(c), m, n + 4, { align: h });
      }
      s += o[l];
    });
    return n + 5;
  };

  const Gs = (e, t, n, r, o, i) => {
    e.setTextColor(...Mi.text);
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    let s = t;
    for (let l = 0; l < r.length - 1; l++) {
      e.rect(s, n, o[l], 5);
      const h = i?.includes(l) ? 'center' : undefined;
      const m = h === 'center' ? s + o[l] / 2 : s + 1;
      if (String(r[l]) === '&#10003' || String(r[l]) === '✓') {
        e.setFont('ZapfDingbats', 'normal');
        e.setFontSize(pn.small);
        e.text('4', m, n + 4, { align: h });
        e.setFont('helvetica', 'normal');
      } else {
        e.setFont('helvetica', 'normal');
        e.setFontSize(pn.small);
        e.text(String(r[l]), m, n + 4, { align: h });
      }
      s += o[l];
    }
    const c = o.slice(r.length - 1).reduce((w, N) => w + N, 0);
    e.rect(s, n, c, 5);
    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.text(String(r[r.length - 1] || ''), s + 1, n + 4);
    return n + 5;
  };

  const P1 = (e, t, n, r, o, i, s) => {
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.setFillColor(0, 0, 0);
    e.setTextColor(255, 255, 255);
    e.setFont('helvetica', 'bold');
    e.setFontSize(pn.small);
    e.rect(t, n, i, s, 'FD');
    e.text(r, t + 2, n + s - 1);
    e.text(o, t + i - 2, n + s - 1, { align: 'right' });
    return n + s;
  };

  const D1 = (e, t, n) => {
    let r = n.yPositionLeft;
    let o = n.yPositionRight;
    const i = t.wacData || {};
    const s = t.formData || {};
    n.checkPageBreak(40);

    const c = Oa.checklist.reduce((T, V) => T + V, 0);
    const l = n.rightColumnWidth;
    const h = 5;

    r = Fa(e, n.leftColumnX, r, 'Data Kendaraan', c);
    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.setTextColor(...Mi.text);

    const m = s?.policeNumber || s?.detail?.policeNumber || i.policeNumber || i.plateNumber || 'N/A';
    const b = s?.detail?.mileage ?? s?.mileage ?? i.detail?.mileageFromWAC ?? i.mileage ?? 0;
    const vin = i.VIN || s?.detail?.VIN || i.detail?.VIN || 'N/A';
    const colName = t.vehicleInfo?.color || s?.detail?.vehicleColor || i.vehicleColorName || 'N/A';
    const modName = t.vehicleInfo?.model || s?.detail?.vehicleModel || i.vehicleVariant || 'N/A';
    const prodYear = t.vehicleInfo?.year ? String(t.vehicleInfo.year) : (i.productionYear ? String(i.productionYear) : 'N/A');

    const g = [
      ['No. Rangka', vin],
      ['Warna', colName],
      ['Model', modName],
      ['Plat Mobil', m],
      ['Tahun produksi', prodYear],
      ['Jarak tempuh', String(b) + (typeof b === 'number' || !isNaN(Number(b)) ? ' KM' : '')]
    ];

    const v = r;
    const w = g.length * 5;
    const N = n.leftColumnX;

    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.line(N, v, N, v + w);
    e.line(N + c, v, N + c, v + w);
    e.line(N, v, N + c, v);
    e.line(N, v + w, N + c, v + w);

    g.forEach((T, V) => {
      const q = v + V * h;
      e.text(T[0], N + 1, q + 4);
      e.text(String(T[1]), N + c - 1, q + 4, { align: 'right' });
    });
    r = v + w;

    // Header Right Box: Data Servis
    const S = s?.outletName || s?.detail?.dealerOutletName || s?.dealerOutlet || s?.detail?.outletName || 'Tunas Toyota Radin Inten';
    const D = i.createdAt ? (typeof i.createdAt === 'number' ? i.createdAt * 1000 : new Date(i.createdAt).getTime()) : Date.now();
    const dateStr = new Date(D).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const O = i.bookingNumber || s?.detail?.bookingNumber || i.WACSummary?.bookingNumber || '-';

    const Q = [
      ['Dealer Outlet', S],
      ['Tanggal Pengerjaan', dateStr],
      ['Nomor WO', O]
    ];

    const fe = n.rightColumnX;
    const K = o;
    o = Fa(e, fe, K, 'Data Servis', l);

    const te = o;
    const ie = Q.length * 5;
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.line(fe, te, fe, te + ie);
    e.line(fe + l, te, fe + l, te + ie);
    e.line(fe, te, fe + l, te);
    e.line(fe, te + ie, fe + l, te + ie);

    Q.forEach((oe, ae) => {
      const de = te + ae * h;
      e.text(oe[0], fe + 1, de + 4);
      e.text(String(oe[1]), fe + l - 1, de + 4, { align: 'right' });
    });
    o = te + ie;

    n.yPositionLeft = r;
    n.yPositionRight = o;
    return Math.max(r, o);
  };

  const _1 = (e, t, n) => {
    let r = n.yPositionLeft;
    const o = t.formData ?? {};
    n.checkPageBreak(30);

    const s = Oa.checklist;
    const c = s.reduce((g, v) => g + v, 0);

    r = Fa(e, n.leftColumnX, r, 'Checklist Interior', c);
    r = Fc(e, n.leftColumnX, r, ['No.', 'Item Yang Dicek', 'Baik', 'Tdk. Baik'], s, [2, 3]);

    const l = o?.checklist?.interiors || o?.checklist?.interiorItems || [];
    const h = l?.filter(g => g.category === 'INTERIOR' && g.partConst?.toUpperCase() !== 'SPARE_TIRE') || [];
    const m = l?.find(g => g.category === 'INTERIOR' && g.partConst?.toUpperCase() === 'SPARE_TIRE');

    if (h && h.length > 0) {
      h.forEach((g, v) => {
        n.checkPageBreak(6);
        const w = g.status === 'GOOD' ? '&#10003' : '';
        const N = g.status === 'BAD' ? '&#10003' : '';
        r = Hs(e, n.leftColumnX, r, [String(v + 1), g.partName || '', w, N], s, [2, 3]);
      });
    } else {
      [
        ['1', 'Power Window', '&#10003', ''],
        ['2', 'Dashboard', '&#10003', ''],
        ['3', 'Seat', '&#10003', '']
      ].forEach(v => {
        n.checkPageBreak(6);
        r = Hs(e, n.leftColumnX, r, v, s, [2, 3]);
      });
    }

    if (m) {
      n.checkPageBreak(6);
      const g = m.status === 'EXIST' ? 'Ada' : 'Tidak Ada';
      r = Gs(e, n.leftColumnX, r, [String(h.length + 1), 'Ban Serep', g], s, [2, 3]);
    } else {
      n.checkPageBreak(6);
      r = Gs(e, n.leftColumnX, r, ['4', 'Ban Serep', 'Ada'], s, [2, 3]);
    }

    return r;
  };

  const O1 = (e, t, n) => {
    let r = n.yPositionLeft;
    const o = t.formData ?? {};
    n.checkPageBreak(30);

    const s = Oa.other;
    const c = s.reduce((g, v) => g + v, 0);

    r = Fa(e, n.leftColumnX, r, 'Checklist Lainnya', c);
    r = Fc(e, n.leftColumnX, r, ['No.', 'Item Yang Dicek', 'Baik', 'Tdk. Baik'], s, [2, 3]);

    const h = (o?.checklist?.interiors || o?.checklist?.interiorItems || [])?.filter(g => g.category === 'OTHERS') || [];
    if (h && h.length > 0) {
      h.forEach((g, v) => {
        n.checkPageBreak(6);
        const w = g.status === 'GOOD' ? '&#10003' : '';
        const N = g.status === 'BAD' ? '&#10003' : '';
        r = Hs(e, n.leftColumnX, r, [String(v + 1), g.partName || '', w, N], s, [2, 3]);
      });
    } else {
      [
        ['1', 'Battery', '&#10003', ''],
        ['2', 'Alarm', '&#10003', ''],
        ['3', 'Engine Room', '&#10003', ''],
        ['4', 'Oil Condition', '&#10003', '']
      ].forEach(v => {
        n.checkPageBreak(6);
        r = Hs(e, n.leftColumnX, r, v, s, [2, 3]);
      });
    }

    n.checkPageBreak(6);
    const m = o?.checklist?.otherDescription || '';
    const b = h.length > 0 ? h.length + 1 : 5;
    r = Gs(e, n.leftColumnX, r, [String(b), 'Deskripsi Lainnya', m], s, [2, 3]);

    return r;
  };

  const Rs = (e, t) => {
    if (!e) return '-';
    const c = e.color || '';
    const colorMap = { GREEN: 'Hijau', RED: 'Merah', YELLOW: 'Kuning', DEFAULT: 'Default' };
    return colorMap[c] || c || '-';
  };

  const F1 = (e, t, n) => {
    let r = n.yPositionLeft;
    const o = t.formData ?? {};
    n.checkPageBreak(25);

    const i = Oa.tire;
    const s = i.reduce((l, h) => l + h, 0);

    r = Fa(e, n.leftColumnX, r, 'Ban', s);
    r = Fc(e, n.leftColumnX, r, ['No.', 'Item Yang Dicek', 'Warna', 'Tahun'], i, [2, 3]);

    const tires = o?.checklist?.tire || {};
    const tRows = [
      ['1', 'Kiri Depan', Rs(tires.leftFront), String(tires.leftFront?.year ?? '')],
      ['2', 'Kiri Belakang', Rs(tires.leftRear), String(tires.leftRear?.year ?? '')],
      ['3', 'Kanan Belakang', Rs(tires.rightRear), String(tires.rightRear?.year ?? '')],
      ['4', 'Kanan Depan', Rs(tires.rightFront), String(tires.rightFront?.year ?? '')]
    ];

    tRows.forEach(v => {
      n.checkPageBreak(6);
      r = Hs(e, n.leftColumnX, r, v, i, [2, 3]);
    });

    return r;
  };

  const W1 = (e, t, n) => {
    let r = n.yPositionLeft;
    const o = t.formData ?? {};
    n.checkPageBreak(20);

    const s = Oa.other.reduce((S, D) => S + D, 0);
    r = Fa(e, n.leftColumnX, r, 'Bahan Bakar', s);

    const c = (o?.checklist?.fuelIndicatorV2 ?? 0) * 100;
    const l = Math.round(c);

    n.checkPageBreak(16);
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    e.rect(n.leftColumnX, r, s, 12);

    const h = n.leftColumnX + 2;
    const m = r + 6;
    const b = s - 4;
    const y = 2;

    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.setTextColor(80, 80, 80);
    e.text('Kosong', h, m - 1.5);
    e.setFillColor(200, 200, 200);
    e.rect(h, m, b, y, 'F');

    const g = (b * l) / 100;
    e.setFillColor(100, 100, 100);
    e.rect(h, m, g, y, 'F');
    e.setDrawColor(80, 80, 80);
    e.setLineWidth(0.2);
    e.rect(h, m, b, y);

    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.setTextColor(80, 80, 80);
    e.text('Penuh', h + b - 8, m - 1.5);

    const v = h + g;
    const w = m + y + 1.5;
    const N = 1.2;
    e.setFillColor(100, 100, 100);
    e.setDrawColor(60, 60, 60);
    e.setLineWidth(0.3);
    e.circle(v, w, N, 'FD');

    e.setLineWidth(0.15);
    e.setDrawColor(150, 150, 150);
    for (let S = 0; S <= 8; S++) {
      const D = h + (b * S) / 8;
      const O = S % 2 === 0 ? 1 : 0.5;
      e.line(D, m - O, D, m);
    }
    return r + 12;
  };

  const E1 = (e, t, n) => {
    let r = n.yPositionLeft;
    const o = t.formData ?? {};
    n.checkPageBreak(15);

    const s = Oa.other.reduce((m, b) => m + b, 0);
    r = Fa(e, n.leftColumnX, r, 'Barang Yang Tertinggal', s);

    const c = o?.checklist?.description || '';
    n.checkPageBreak(6);
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);
    const l = c ? Math.max(5, (c.length / 30) * 5) : 5;
    e.rect(n.leftColumnX, r, s, l);
    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.setTextColor(0, 0, 0);
    const h = e.splitTextToSize(c || '-', s - 2);
    e.text(h, n.leftColumnX + 1, r + 3);
    return r + l;
  };

  const M1 = (e, t, n, r, o, i, s) => {
    const c = s.annotations ?? [];
    t.forEach(l => {
      const h = n + (l.x / 100) * o;
      const m = r + ((100 - l.y) / 100) * i;
      const b = c.find(v => v.annotationPoint === l.value);
      if (!(b && (b?.data?.condition?.length > 0 || b?.data?.description?.trim()?.length > 0 || b?.data?.images?.length > 0))) return;
      const g = 3.5;
      e.setFillColor(206, 7, 24); // Toyota Red for damage points
      e.setDrawColor(206, 7, 24);
      e.setLineWidth(0.5);
      e.circle(h, m, g, 'FD');
      e.setTextColor(255, 255, 255);
      e.setFontSize(7);
      e.setFont('helvetica', 'bold');
      e.text(l.value.toString(), h, m + 1.2, { align: 'center' });
    });
  };

  const B1 = (e, t, n) => {
    let r = n.yPositionRight;
    n.checkPageBreak(20);
    const o = n.rightColumnWidth;

    r = Fa(e, n.rightColumnX, r, 'Anotasi', o);
    if (t.annotationImage) {
      try {
        n.checkPageBreak(121);
        e.setDrawColor(0, 0, 0);
        e.setLineWidth(0.3);
        e.rect(n.rightColumnX, r, o, 116);
        const h = n.rightColumnX + (o - 80) / 2;
        const m = r + 4 / 2;
        e.addImage(t.annotationImage, 'PNG', h, m, 80, 112);
        if (t.annotationPositionList && t.annotationPositionList.length > 0) {
          M1(e, t.annotationPositionList, h, m, 80, 112, t);
        }
        r += 116;
      } catch (i) {
        console.error('Error adding annotation image to PDF:', i);
      }
    }
    return r;
  };

  const q1 = (e, t, n) => {
    let r = n.yPositionRight;
    const o = t.formData ?? {};
    const s = t.annotations || o?.annotations || [];
    const l = s.filter(h => {
      const m = h?.data?.description?.trim?.().length > 0;
      const b = h?.data?.condition?.length > 0;
      return m || b;
    });

    if (l && l.length > 0) {
      const h = n.rightColumnWidth;
      const b = h - 30 - 8;
      const y = 4;
      const g = 1;

      l.forEach((v, w) => {
        const N = v?.annotationPoint || w + 1;
        const S = v?.data?.condition?.join(', ') || 'N/A';
        const D = v?.data?.description || '';
        const O = e.splitTextToSize(S, b);
        const Y = e.splitTextToSize(D, b);
        const Q = Math.max(y, O.length * y) + g * 2;
        const fe = Math.max(y, Y.length * y) + g;
        const K = Q + fe;

        n.checkPageBreak(6 + K);
        r = n.yPositionRight;
        r = P1(e, n.rightColumnX, r, 'Titik Yang Dicek', N.toString(), h, 6);

        e.setDrawColor(0, 0, 0);
        e.setLineWidth(0.3);
        e.setFont('helvetica', 'normal');
        e.setFontSize(pn.small);
        e.setTextColor(...Mi.text);

        const se = n.rightColumnX;
        const ue = r;
        const P = ue + g;

        e.line(se, ue, se, ue + K);
        e.line(se + h, ue, se + h, ue + K);
        e.line(se, ue, se + h, ue);
        e.line(se, ue + K, se + h, ue + K);

        e.text('Kondisi:', se + 2, P + 3);
        e.text(O, se + 30, P + 3);

        const T = ue + Q;
        e.line(se, T, se + h, T);
        e.text('Deskripsi:', se + 2, T + 3);
        e.text(Y, se + 30, T + 3);

        r += K + 2;
        n.yPositionRight = r;
      });
    }
    return r;
  };

  const H1 = async (e, t, n) => {
    n.checkPageBreak(35);
    let r = n.yPositionRight + 5;
    const o = (n.rightColumnWidth - 3) / 2;
    const i = 28;

    const s = h => (h ? (typeof h === 'string' ? h : (h.base64 ? h.base64 : (h.url ? h.url : null))) : null);
    const c = s(t.signatures?.serviceAdvisor);
    const l = s(t.signatures?.customer);

    e.setFont('helvetica', 'normal');
    e.setFontSize(pn.small);
    e.setDrawColor(0, 0, 0);
    e.setLineWidth(0.3);

    // Left Signature: SA
    e.rect(n.rightColumnX, r, o, i);
    e.text('SA', n.rightColumnX + o / 2, r + 4, { align: 'center' });
    if (c) {
      try {
        const h = await Ys(c);
        const m = h.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
        e.addImage(h, m, n.rightColumnX + 2, r + 6, o - 4, i - 8);
      } catch (h) {
        console.warn('Failed to load SA signature:', h);
      }
    }

    // Right Signature: Pelanggan
    e.rect(n.rightColumnX + o + 3, r, o, i);
    e.text('Pelanggan', n.rightColumnX + o + 3 + o / 2, r + 4, { align: 'center' });
    if (l) {
      try {
        const h = await Ys(l);
        const m = h.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
        e.addImage(h, m, n.rightColumnX + o + 5, r + 6, o - 4, i - 8);
      } catch (h) {
        console.warn('Failed to load customer signature:', h);
      }
    }

    r += i;
    return r;
  };

  const Y1 = async (e, t, n) => {
    let r = _n.top;
    const s = t.annotations || t.formData?.annotations || [];
    const h = s.filter(b => {
      const y = b?.images || b?.data?.images || [];
      return Array.isArray(y) && y.length > 0;
    });

    const m = () => {
      e.setFont('helvetica', 'bold');
      e.setFontSize(pn.heading);
      e.text('FOTO DOKUMENTASI', n.pageWidth / 2, _n.top, { align: 'center' });
      return _n.top + 8;
    };

    r = m();

    if (h && h.length > 0) {
      for (const b of h) {
        const y = b.annotationPoint || 0;
        const g = b?.images || b?.data?.images || [];
        const v = n.pageWidth - _n.left - _n.right;
        const w = 8;
        const N = 5;
        const S = 3;
        const D = 8;
        const O = Math.floor((v - S * (N + 1)) / N);
        const Y = Math.ceil(g.length / N);
        const Q = O + D;
        const fe = Y * Q;
        const K = w + fe + 2;

        if (r + K > n.pageHeight - _n.bottom) {
          e.addPage();
          r = m();
        }

        r = Fa(e, _n.left, r, Foto - Titik , v);
        e.setDrawColor(0, 0, 0);
        e.setLineWidth(0.3);
        e.rect(_n.left, r, v, fe);
        e.setFont('helvetica', 'normal');
        e.setFontSize(pn.small);
        e.setTextColor(...Mi.text);

        const B = 4;
        for (let se = 0; se < g.length; se++) {
          const ue = g[se];
          const P = Math.floor(se / N);
          const T = se % N;
          const V = _n.left + 2 + T * (O + S);
          const q = r + 5 + P * Q;
          try {
            const te = ue?.base64 || ue?.url;
            if (!te) continue;
            const ie = await G1(te, O, O, B);
            e.addImage(ie, 'PNG', V, q, O, O);
          } catch {
            e.setDrawColor(200, 200, 200);
            e.setFillColor(220, 220, 220);
            e.roundedRect(V, q, O, O, B, B, 'FD');
          }
        }
        r += fe + 4;
      }
    } else {
      e.setFont('helvetica', 'normal');
      e.setFontSize(pn.small);
      e.text('Tidak ada foto kerusakan yang tersedia.', _n.left, r + 5);
    }
    n.yPositionLeft = r;
  };

  const  = async e => {
    const jsPDF = window.jspdf.jsPDF;
    const t = new jsPDF({ format: 'a4', unit: 'mm' });
    const n = t.internal.pageSize.getHeight();
    const r = t.internal.pageSize.getWidth();
    const o = _n.left;
    const i = Cc.left;
    const s = o + i + Cc.spacing;
    const c = r - s - _n.right;

    let l = 0, h = 0;
    const m = {
      yPositionLeft: l,
      yPositionRight: h,
      pageHeight: n,
      pageWidth: r,
      leftColumnX: o,
      leftColumnWidth: i,
      rightColumnX: s,
      rightColumnWidth: c,
      checkPageBreak: b => {
        if (Math.max(m.yPositionLeft, m.yPositionRight) + b > n - _n.bottom) {
          t.addPage();
          m.yPositionLeft = _n.top;
          m.yPositionRight = _n.top;
        }
      }
    };

    l = T1(t, m);
    h = l;
    m.yPositionLeft = l;
    m.yPositionRight = h;

    l = D1(t, e, m);
    h = l;
    m.yPositionLeft = l;
    m.yPositionRight = h;

    h = B1(t, e, m);
    m.yPositionRight = h;

    l = _1(t, e, m);
    m.yPositionLeft = l;

    l = F1(t, e, m);
    m.yPositionLeft = l;

    l = O1(t, e, m);
    m.yPositionLeft = l;

    l = W1(t, e, m);
    m.yPositionLeft = l;

    l = E1(t, e, m);
    m.yPositionLeft = l;

    h = q1(t, e, m);
    m.yPositionRight = h;

    h = await H1(t, e, m);
    m.yPositionRight = h;

    t.addPage();
    await Y1(t, e, m);

    return t;
  };

  window.generateAndDownloadWACPDF = async function(wacData, filename) {
    if (!wacData) throw new Error('WAC data tidak tersedia');
    
    // Ensure annotation image is loaded
    let annotImg = null;
    try {
      annotImg = await Ys('/img/WAC_anotation.png');
    } catch (err) {
      console.warn('Gagal memuat blueprint WAC_anotation.png:', err);
    }

    // Prepare annotationPositionList
    const annotPositions = window.ANNOTATION_POINTS || [];

    // Signatures
    const sigs = {
      customer: wacData.signature?.customerSignature || wacData.signature?.customer || null,
      serviceAdvisor: wacData.signature?.serviceAdvisorSignature || wacData.signature?.serviceAdvisor || null
    };

    // Format annotations
    const annotList = (wacData.annotations || []).map(a => {
      if (a.data) return a;
      return {
        annotationPoint: a.annotationPoint,
        data: {
          condition: a.conditions || (a.condition ? [a.condition] : []),
          description: a.description || '',
          images: a.images || []
        }
      };
    });

    const pdfInput = {
      wacData: wacData,
      formData: {
        detail: wacData.detail,
        checklist: wacData.checklist,
        recommendations: wacData.recommendations,
        annotations: annotList
      },
      vehicleInfo: {
        model: wacData.detail?.vehicleModel || wacData.vehicleVariant || '',
        color: wacData.detail?.vehicleColor || wacData.vehicleColorName || '',
        year: wacData.detail?.productionYear || wacData.productionYear || ''
      },
      annotationImage: annotImg,
      annotations: annotList,
      annotationPositionList: annotPositions,
      signatures: sigs
    };

    const doc = await (pdfInput);
    const fname = filename || WAC__.pdf;
    doc.save(fname);
    return true;
  };

})(window);
