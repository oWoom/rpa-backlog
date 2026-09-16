'use client';

import { useEffect, useMemo, useState } from 'react';

const seed = [
  {
    id: 'RPA-001',
    name: 'Müşteri Evrak Kontrolü',
    description: 'Gelen evrakların kontrol edilmesi ve ilgili alanların sisteme aktarılması.',
    businessUnit: 'Operasyon',
    directorate: 'Operasyon Müdürlüğü',
    team: 'Belge Operasyonları',
    changeLead: 'Ahmet Yılmaz',
    automationType: 'RPA',
    requestType: 'Yeni Süreç',
    monthlyCount: 4200,
    duration: 6,
    fte: 0.72,
    revenue: 0,
    employeeImpact: 4,
    customerImpact: 3,
    regulation: 'Hayır',
    status: 'Ön Analiz',
    createdAt: '16.09.2026',
    notes: ''
  },
  {
    id: 'RPA-002',
    name: 'Mutabakat Dosyası Kontrolü',
    description: 'Aylık mutabakat dosyalarının kontrol ve raporlama adımlarının otomasyonu.',
    businessUnit: 'Finans',
    directorate: 'Finans Müdürlüğü',
    team: 'Mutabakat Ekibi',
    changeLead: 'Mehmet Kaya',
    automationType: 'RPA',
    requestType: 'Yeni Süreç',
    monthlyCount: 1800,
    duration: 12,
    fte: 1.25,
    revenue: 0,
    employeeImpact: 5,
    customerImpact: 2,
    regulation: 'Evet',
    status: 'Değerlendirme',
    createdAt: '15.09.2026',
    notes: ''
  },
  {
    id: 'RPA-003',
    name: 'Belge OCR Doğrulama',
    description: 'OCR ile çıkarılan alanların doğruluk oranlarının kontrol edilmesi.',
    businessUnit: 'Teknoloji',
    directorate: 'Dijital Çözümler',
    team: 'AI & OCR',
    changeLead: 'Elif Demir',
    automationType: 'OCR',
    requestType: 'Yeni Süreç',
    monthlyCount: 7500,
    duration: 2,
    fte: 0.48,
    revenue: 150000,
    employeeImpact: 3,
    customerImpact: 5,
    regulation: 'Hayır',
    status: 'Geliştirme',
    createdAt: '12.09.2026',
    notes: ''
  }
];

const lists = {
  businessUnit: ['Operasyon', 'Finans', 'Teknoloji', 'İnsan Kaynakları', 'Hukuk', 'Müşteri Deneyimi'],
  directorate: ['Operasyon Müdürlüğü', 'Finans Müdürlüğü', 'Dijital Çözümler', 'İK Müdürlüğü', 'Hukuk Müdürlüğü'],
  team: ['Belge Operasyonları', 'Mutabakat Ekibi', 'AI & OCR', 'RPA Ekibi', 'Müşteri Operasyonları'],
  changeLead: ['Ahmet Yılmaz', 'Mehmet Kaya', 'Elif Demir', 'Ayşe Çelik', 'Can Aydın'],
  automationType: ['RPA', 'AI', 'OCR', 'LLM'],
  requestType: ['Yeni Süreç', 'Ek Talep'],
  regulation: ['Hayır', 'Evet'],
  status: ['Yeni Talep', 'Ön Analiz', 'Değerlendirme', 'Geliştirme', 'Test', 'Canlı', 'Beklemede', 'Tamamlandı', 'İptal']
};

const empty = {
  name: '', description: '', businessUnit: '', directorate: '', team: '',
  changeLead: '', automationType: 'RPA', requestType: 'Yeni Süreç',
  monthlyCount: '', duration: '', fte: '', revenue: '',
  employeeImpact: '', customerImpact: '', regulation: 'Hayır',
  status: 'Yeni Talep', notes: ''
};

function score(t) {
  const fte = Number(t.fte) || 0;
  const revenue = Number(t.revenue) || 0;
  const emp = Number(t.employeeImpact) || 0;
  const cust = Number(t.customerImpact) || 0;
  return Math.min(100, Math.round(
    Math.min(30, fte * 15) +
    Math.min(25, revenue / 20000) +
    emp * 5 +
    cust * 5
  ));
}

function Input({ label, children, required }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{children}</label>
}

export default function Home() {
  const [items, setItems] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [filterType, setFilterType] = useState('Tümü');

  useEffect(() => {
    const saved = localStorage.getItem('rpa-backlog-items');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('rpa-backlog-items', JSON.stringify(items));
  }, [items]);

  const filtered = useMemo(() => items.filter(x => {
    const q = query.toLowerCase();
    const matchesQ = !q || [x.id,x.name,x.businessUnit,x.team,x.changeLead].join(' ').toLowerCase().includes(q);
    const matchesS = filterStatus === 'Tümü' || x.status === filterStatus;
    const matchesT = filterType === 'Tümü' || x.automationType === filterType;
    return matchesQ && matchesS && matchesT;
  }), [items, query, filterStatus, filterType]);

  const update = (k,v) => setForm(f => ({...f, [k]:v}));

  function newItem() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function editItem(item) {
    setEditing(item.id);
    setForm({...item});
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.businessUnit || !form.directorate || !form.team || !form.changeLead) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }
    if (editing) {
      setItems(items.map(x => x.id === editing ? {...form, id: editing} : x));
    } else {
      const n = items.length + 1;
      const id = `RPA-${String(n).padStart(3,'0')}`;
      const today = new Date().toLocaleDateString('tr-TR');
      setItems([{...form, id, createdAt: today}, ...items]);
    }
    setOpen(false);
  }

  function remove(id) {
    if (confirm('Bu talebi silmek istediğinize emin misiniz?')) {
      setItems(items.filter(x => x.id !== id));
    }
  }

  function resetDemo() {
    if (confirm('Demo verileri geri yüklensin mi?')) {
      setItems(seed);
      localStorage.removeItem('rpa-backlog-items');
    }
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <div className="logo">RPA</div>
          <div><strong>RPA Backlog</strong><small>Talep Yönetimi</small></div>
        </div>
        <button className="primary" onClick={newItem}>＋ Yeni Talep</button>
      </header>

      <section className="content">
        <div className="heading">
          <div>
            <h1>RPA Backlog</h1>
            <p>RPA, AI, OCR ve LLM taleplerini tek ekrandan yönetin.</p>
          </div>
          <div className="counter">{items.length} Talep</div>
        </div>

        <div className="toolbar">
          <div className="search">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Talep ara..." /></div>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option>Tümü</option>{lists.status.map(x=><option key={x}>{x}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
            <option>Tümü</option>{lists.automationType.map(x=><option key={x}>{x}</option>)}
          </select>
          <button className="ghost" onClick={resetDemo}>Demo Verilerini Sıfırla</button>
        </div>

        <div className="tableCard">
          <table>
            <thead><tr>
              <th>ID</th><th>Süreç</th><th>İş Birimi</th><th>Ekip</th><th>Otomasyon</th>
              <th>Talep Türü</th><th>FTE</th><th>Kazanım</th><th>Durum</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(x => (
                <tr key={x.id} onDoubleClick={()=>editItem(x)}>
                  <td><span className="id">{x.id}</span></td>
                  <td><strong>{x.name}</strong><small>{x.createdAt}</small></td>
                  <td>{x.businessUnit}</td>
                  <td>{x.team}</td>
                  <td><span className="tag">{x.automationType}</span></td>
                  <td>{x.requestType}</td>
                  <td>{Number(x.fte || 0).toFixed(2)}</td>
                  <td><span className="score">{score(x)}</span></td>
                  <td><span className={'status s-'+x.status.replaceAll(' ','-')}>{x.status}</span></td>
                  <td className="actions"><button onClick={()=>editItem(x)}>Düzenle</button><button onClick={()=>remove(x.id)}>Sil</button></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="10" className="empty">Kriterlere uygun talep bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>

        <p className="hint">Demo verileri tarayıcınızın LocalStorage alanında tutulur. Vercel'e deploy edildiğinde veritabanı gerekmeden deneme yapabilirsiniz.</p>
      </section>

      {open && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget && setOpen(false)}>
        <form className="modal" onSubmit={save}>
          <div className="modalHead">
            <div><h2>{editing ? 'Talebi Düzenle' : 'Yeni RPA Talebi'}</h2><p>{editing || 'Yeni backlog kaydı oluşturun'}</p></div>
            <button type="button" className="close" onClick={()=>setOpen(false)}>×</button>
          </div>

          <div className="formGrid">
            <Input label="Süreç Adı" required><input value={form.name} onChange={e=>update('name',e.target.value)} /></Input>
            <Input label="Otomasyon Türü"><select value={form.automationType} onChange={e=>update('automationType',e.target.value)}>{lists.automationType.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="İş Birimi" required><select value={form.businessUnit} onChange={e=>update('businessUnit',e.target.value)}><option value="">Seçiniz</option>{lists.businessUnit.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="Müdürlük" required><select value={form.directorate} onChange={e=>update('directorate',e.target.value)}><option value="">Seçiniz</option>{lists.directorate.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="Ekip" required><select value={form.team} onChange={e=>update('team',e.target.value)}><option value="">Seçiniz</option>{lists.team.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="Change Lead Adı Soyadı" required><select value={form.changeLead} onChange={e=>update('changeLead',e.target.value)}><option value="">Seçiniz</option>{lists.changeLead.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="Talep Türü"><select value={form.requestType} onChange={e=>update('requestType',e.target.value)}>{lists.requestType.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="Durum"><select value={form.status} onChange={e=>update('status',e.target.value)}>{lists.status.map(x=><option key={x}>{x}</option>)}</select></Input>
            <Input label="İşlem Adedi (Aylık)"><input type="number" min="0" value={form.monthlyCount} onChange={e=>update('monthlyCount',e.target.value)} /></Input>
            <Input label="1 İşlemin İşlem Süresi (dk)"><input type="number" min="0" step="0.1" value={form.duration} onChange={e=>update('duration',e.target.value)} /></Input>
            <Input label="FTE Kazanımı"><input type="number" min="0" step="0.01" value={form.fte} onChange={e=>update('fte',e.target.value)} /></Input>
            <Input label="Gelir Beklentisi (TL)"><input type="number" min="0" value={form.revenue} onChange={e=>update('revenue',e.target.value)} /></Input>
            <Input label="Çalışan Etkisi"><select value={form.employeeImpact} onChange={e=>update('employeeImpact',e.target.value)}><option value="">Seçiniz</option>{[1,2,3,4,5].map(x=><option key={x} value={x}>{x} — {['Çok Düşük','Düşük','Orta','Yüksek','Çok Yüksek'][x-1]}</option>)}</select></Input>
            <Input label="Müşteriye Etkisi"><select value={form.customerImpact} onChange={e=>update('customerImpact',e.target.value)}><option value="">Seçiniz</option>{[1,2,3,4,5].map(x=><option key={x} value={x}>{x} — {['Çok Düşük','Düşük','Orta','Yüksek','Çok Yüksek'][x-1]}</option>)}</select></Input>
            <Input label="Regülasyon Değişikliği Mevcut mu?"><select value={form.regulation} onChange={e=>update('regulation',e.target.value)}>{lists.regulation.map(x=><option key={x}>{x}</option>)}</select></Input>
            <div className="scoreBox"><span>Kazanım Skoru</span><strong>{score(form)}<small>/100</small></strong><em>Otomatik hesaplanır</em></div>
            <Input label="Süreç Açıklaması" ><textarea className="wide" rows="3" value={form.description} onChange={e=>update('description',e.target.value)} /></Input>
            <Input label="Açıklama / Notlar"><textarea className="wide" rows="3" value={form.notes} onChange={e=>update('notes',e.target.value)} /></Input>
          </div>

          <div className="modalFoot">
            <button type="button" className="ghost" onClick={()=>setOpen(false)}>Vazgeç</button>
            <button className="primary" type="submit">{editing ? 'Değişiklikleri Kaydet' : 'Talebi Oluştur'}</button>
          </div>
        </form>
      </div>}
    </main>
  );
}
